import app from "./app.js";
import { env } from "./config/env.js";
import { ensurePaths } from "./config/paths.js";

ensurePaths();

app.listen(env.PORT, () => {
  console.log(`서버가 http://localhost:${env.PORT} 에서 실행중입니다`);
});