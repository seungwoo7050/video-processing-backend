import { env } from "./config/env.js";
import { ensurePaths } from "./config/paths.js";

ensurePaths();

console.log("Worker가 시작되었습니다 role=worker", { env: env.NODE_ENV });