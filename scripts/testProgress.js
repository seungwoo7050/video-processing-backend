import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const worker = new Worker(path.join(__dirname, "../src/workers/progressWorker.js"), {
  workerData: { steps: 10000000 }
});

worker.on("message", (message) => {
  if (message.type === "progress") {
    console.log(`진행률: ${message.value}%`);
  } else if (message.type === "complete") {
    console.log("완료:", message.result);
  }
});

worker.on("error", (error) => console.error("에러:", error));
worker.on("exit", (code) => console.log("종료 코드:", code));
