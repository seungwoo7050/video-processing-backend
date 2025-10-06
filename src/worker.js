import { env } from "./config/env.js";

console.log("Worker가 시작되었습니다", { env: env.NODE_ENV });