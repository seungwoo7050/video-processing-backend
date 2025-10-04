import { parentPort, workerData } from 'worker_threads';
import { spawn } from 'child_process';

const { inputPath, outputPath, format } = workerData;

const ffmpeg = spawn('ffmpeg', [
    "-i",
    inputPath,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-c:a",
    "aac",
    outputPath
]);

ffmpeg.stderr.on("data", (data) => {
    const output = data.toString();
    if (output.includes("time=")) {
        parentPort.postMessage({
        type: "progress",
        message: output.trim()
        });
    }
});

ffmpeg.on("close", (code) => {
    if (code === 0) {
        parentPort.postMessage({
        type: "complete",
        outputPath
    });
    } else {
        parentPort.postMessage({
        type: "error",
        message: `FFmpeg 실행 실패 (코드: ${code})`
        });
    }
});