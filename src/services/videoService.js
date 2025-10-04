import { Worker } from "worker_threads";
import path from "path";
import {fileURLToPath, fimeURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const videos = [];
const jobs = new Map();
let nextId = 1;

export function getAllVideos() {
    return videos;
}

export function getVideoById(id) {
    return videos.find((v) => v.id === id);
}

export function createVideo(title, filename) {
    const newVideo = {
        id: nextId++,
        title,
        filename,
        status: "pending",
        createdAt: new Date().toISOString(),
    };
    
    videos.push(newVideo);
    return newVideo;
}

export function deleteVideo(id) {
    const index = videos.findIndex((v) => v.id === id);
    if (index === -1) return false;

    videos.splice(index, 1);
    return true;
}

export function startTranscodeJob(videoId, inputPath, outputPath, format) {
    const jobId = `job_${Date.now()}`;

    jobs.set(jobId, {
        videoId,
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

            const video = videos.find((v) => v.id === videoId);
            if (video) {
                video.status = "completed";
                video.outputPath = message.outputPath;
            }
            return;
        }

        if (message.type === "error") {
            job.status = "failed";
            job.error = message.message;

            const video = videos.find((v) => v.id === videoId);
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

export function getJobStatus(jobId) {
    return jobs.get(jobId);
}