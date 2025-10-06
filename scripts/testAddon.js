import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ffmpeg = require(path.join(__dirname, "../build/Release/ffmpeg_addon.node"));

console.log("FFmpeg 버전:", ffmpeg.getVersion());

const info = ffmpeg.getVideoInfo(path.join(process.cwd(), "test.mp4"));
console.log("비디오 정보:", info);
