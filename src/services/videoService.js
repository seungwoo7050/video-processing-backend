import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../db/prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const videos = [];
const jobs = new Map();
let nextId = 1;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function toIntId(value, name = "id") {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw new HttpError(400, `유효하지 않은 ${name}입니다`);
  }
  return n;
}

function ownerKey(ownerId) {
  return String(ownerId);
}

function ensureOwned(resourceOwnerId, requesterOwnerId) {
  if (ownerKey(resourceOwnerId) !== ownerKey(requesterOwnerId)) {
    throw new HttpError(403, "접근 권한이 없습니다");
  }
}

function findVideoById(id) {
  return videos.find((video) => video.id === id);
}

export async function getVideosByOwnerDb(ownerId) {
  const ownerIdNum = toIntId(ownerId, "ownerId");
  return prisma.video.findMany({
    where: { ownerId: ownerIdNum },
    orderBy: { createdAt: "desc" },
  });
}

export async function getVideoByIdDb(id, ownerId) {
  const videoId = toIntId(id, "id");
  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new HttpError(404, "비디오를 찾을 수 없습니다");
  }

  ensureOwned(video.ownerId, ownerId);
  return video;
}

export async function deleteVideoDb(id, ownerId) {
  const video = await getVideoByIdDb(id, ownerId);
  await prisma.video.delete({ where: { id: video.id } });
}

export function getVideosByOwner(ownerId) {
  const ok = ownerKey(ownerId);
  return videos.filter((video) => ownerKey(video.ownerId) === ok);
}

export function getVideoById(id, ownerId) {
  const video = findVideoById(id);
  if (!video) {
    throw new HttpError(404, "비디오를 찾을 수 없습니다");
  }
  ensureOwned(video.ownerId, ownerId);
  return video;
}

export function createVideo({ title, filename, ownerId }) {
  const newVideo = {
    id: nextId++,
    title,
    filename,
    ownerId: ownerKey(ownerId),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  videos.push(newVideo);
  return newVideo;
}

export function deleteVideo(id, ownerId) {
  const video = findVideoById(id);
  if (!video) {
    throw new HttpError(404, "비디오를 찾을 수 없습니다");
  }
  ensureOwned(video.ownerId, ownerId);

  const index = videos.findIndex((v) => v.id === id);
  videos.splice(index, 1);
}

export function startTranscodeJob(videoId, inputPath, outputPath, format, ownerId) {
  getVideoById(videoId, ownerId);

  const jobId = `job_${Date.now()}`;

  jobs.set(jobId, {
    videoId,
    ownerId: ownerKey(ownerId),
    status: "processing",
    progress: 0,
    inputPath,
    outputPath,
    format,
    lastLog: null,
    createdAt: new Date().toISOString()
  });

  const worker = new Worker(path.join(__dirname, '../workers/transcodeWorker.js'), {
    workerData: { inputPath, outputPath, format }
  });

  worker.on("message", (message) => {
    const job = jobs.get(jobId);
    if (!job) return;

    if (message.type === "progress") {
      job.progress = Math.min(100, (job.progress || 0) + 10);
      job.lastLog = message.message || null;
      return;
    }

    if (message.type === "complete") {
      job.status = "completed";
      job.progress = 100;

      const video = findVideoById(videoId);
      if (video) {
        video.status = "completed";
        video.outputPath = message.outputPath;
      }
      return;
    }

    if (message.type === "error") {
      job.status = "failed";
      job.error = message.message;

      const video = findVideoById(videoId);
      if (video) {
        video.status = "failed";
      }
    }
  });
  
  worker.on("error", (error) => {
    const job = jobs.get(jobId);
    if (!job) return;
    job.status = "failed";
    job.error = error.message;
  });

  return jobId;
}

export function getJobStatus(jobId, ownerId) {
  const job = jobs.get(jobId);
  if (!job) {
    throw new HttpError(404, "작업을 찾을 수 없습니다");
  }
  ensureOwned(job.ownerId, ownerId);
  return job;
}