import express from "express";
import multer from "multer";
import * as videoController from "../controllers/videoController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", videoController.getAllVideos);
router.post("/", videoController.createVideo);
router.post("/upload", upload.single("video"), videoController.uploadVideo);

router.post("/transcode", videoController.startTranscode);
router.get("/jobs/:jobId", videoController.getJobStatus);

router.get("/:id", videoController.getVideoById);
router.delete("/:id", videoController.deleteVideo);

export default router;