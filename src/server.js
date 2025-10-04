import express from "express";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api/videos", videoRoutes);

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행중입니다`);
});
