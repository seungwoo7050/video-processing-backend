import * as videoService from '../services/videoService.js';

export async function getAllVideos(req, res) {
  try {
    const videos = await videoService.getVideosByOwnerDb(req.user.id);
    return res.json(videos);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getVideoById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const video = await videoService.getVideoByIdDb(id, req.user.id);

    return res.json(video);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

export function createVideo(req, res) {
  try {
    const { title, filename } = req.body;

    if (!title || !filename) {
      return res.status(400).json({ error: "제목과 파일 이름은 필수입니다" });
    }

    const newVideo = videoService.createVideo({ title, filename, ownerId: req.user.id });
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function deleteVideo(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    await videoService.deleteVideoDb(id, req.user.id);
    
    return res.status(204).end();
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.message });
  }
}

export function uploadVideo(req, res) {
  try {
    if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다" });
    }

    const video = videoService.createVideo({
      title: req.file.originalname,
      filename: req.file.path,
      ownerId: req.user.id
    });

    res.status(201).json({
    message: "업로드 성공",
    video
    });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export function startTranscode(req, res) {
  try {
    const { videoId, inputPath, outputPath, format } = req.body;

    if (!videoId || !inputPath || !outputPath) {
      return res.status(400).json({ error: "필수 파라미터가 누락되었습니다" });
    }

    const jobId = videoService.startTranscodeJob(
      Number(videoId),
      inputPath,
      outputPath,
      format || 'mp4',
      req.user.id
    );

    res.status(202).json({ jobId, message: "작업이 시작되었습니다" });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export function getJobStatus(req, res) {
  try {
    const jobId = req.params.jobId;
    const job = videoService.getJobStatus(jobId, req.user.id);

    res.json(job);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}