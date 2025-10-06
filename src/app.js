import express from "express";
import videoRoutes from "./routes/videoRoutes.js";

const app = express();

app.use(express.json());

const healthHandler = (req, res) => {
  res.json({ status: "ok", role: "api", uptimesec: Math.floor(process.uptime()) });
}

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use("/api/videos", videoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json(
    isDev
    ? { code: "INTERNAL", message: err.message }
    : { code: "INTERNAL", message: "서버에서 알 수 없는 오류가 발생했습니다"}

  );
});

export default app;