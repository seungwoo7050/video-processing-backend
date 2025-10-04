import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("메인 스레드: Worker 시작");

const worker = new Worker(path.join(__dirname, "workers/simpleWorker.js"), {
  workerData: { iterations: 100000000 }
});

worker.on("message", (message) => {
  console.log("메인 스레드: Worker로부터 결과 받음");
  console.log("결과:", message);
});

worker.on("error", (error) => {
  console.error("Worker 에러:", error);
});

worker.on("exit", (code) => {
  console.log(`메인 스레드: Worker 종료됨 (코드: ${code})`);
});

console.log("메인 스레드: 다른 작업 계속 진행 가능");
