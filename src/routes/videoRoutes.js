import express from 'express';
import * as videoController from '../controllers/videoController.js';

const router = express.Router();

router.get("/", videoController.getAllVideos);
router.get("/:id", videoController.getVideoById);
router.post("/", videoController.createVideo);
router.delete("/:id", videoController.deleteVideo);

export default router;