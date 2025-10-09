import express from "express";
import videoRoutes from "./routes/v1/videoRoutes.js";
import authRoutes from "./routes/v1/authRoutes.js";
import { pingDatabase } from "./db/prisma.js";
import { pingRedis } from "./db/redis.js";
import { env } from "./config/env.js";
import authenticate from "./middlewares/authenticate.js";

const isDev = env.NODE_ENV === "development";

const app = express();

app.use(express.json());

const resolveStatus = async (promiseFactory) => {
  try {
    await promiseFactory();
    return "ok";
  } catch (e) {
    console.error("[health]", e);
    return "fail";
  }
}

const healthHandler = async (req, res) => {
  const timeoutMsDb = 2000;
  const timeoutMsRedis = 500;
  const [db, redis] = await Promise.all([
    resolveStatus(() => pingDatabase(timeoutMsDb)),
    resolveStatus(() => pingRedis(timeoutMsRedis)),
  ]);

  const ok = db === "ok" && redis === "ok";

  res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "degraded",
    role: "api",
    uptimeSec: Math.floor(process.uptime()),
    db,
    redis,
  });
}

app.get("/health", healthHandler);
app.get("/api/health", healthHandler);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/videos", authenticate, videoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json(
    isDev
    ? { code: "INTERNAL", message: err.message }
    : { code: "INTERNAL", message: "서버에서 알 수 없는 오류가 발생했습니다"}

  );
});

export default app;