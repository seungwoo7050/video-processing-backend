import "dotenv/config";
import express from "express";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

const healthHandler = (req, res) => {
  res.json({ status: "ok", message: "서버가 정상적으로 작동 중입니다!" });
}

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use("/api/videos", videoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(500).json({ 
    error: "서버 오류가 발생했습니다!",
    message: process.env.NODE_ENV === "development" ? err.message : undefiend
  });
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행중입니다`);
});

export default app;
