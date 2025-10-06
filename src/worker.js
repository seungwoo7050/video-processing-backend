import { env } from "./config/env.js";
import { ensurePaths } from "./config/path.js";

ensurePaths();

console.log("Worker가 시작되었습니다", { env: env.NODE_ENV });