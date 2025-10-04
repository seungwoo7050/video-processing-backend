import * as videoService from '../services/videoService.js';

export function getAllVideos(req, res) {
    try {
        const videos = videoService.getAllVideos();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export function getVideoById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const video = videoService.getVideoById(id);

        if (!video) {
            return res.status(404).json({ error: "비디오를 찾을 수 없습니다" });
        }

        res.json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export function createVideo(req, res) {
    try {
        const { title, filename } = req.body;

        if (!title || !filename) {
            return res.status(400).json({ error: "제목과 파일 이름은 필수입니다" });
        }

        const newVideo = videoService.createVideo({ title, filename });
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export function deleteVideo(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const deleted = videoService.deleteVideo(id);

        if (!deleted) {
            return res.status(404).json({ error: "비디오를 찾을 수 없습니다" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

