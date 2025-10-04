import express from 'express';
import * as videoController from '../controllers/videoController.js';

const router = express.Router();

router.get("/", videoController.getAllVideos);
router.post("/", videoController.createVideo);

router.post("/transcode", videoController.startTranscode);
router.get("/jobs/:jobId", videoController.getJobStatus);

router.get("/:id", videoController.getVideoById);
router.delete("/:id", videoController.deleteVideo);

export default router;