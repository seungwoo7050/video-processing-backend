import fs from "node:fs";
import path from "node:path";
import { env } from "./env.js";

const resolveDir = (dir) => {
    if (path.isAbsolute(dir)) {
        return dir;
    }
    return path.resolve(process.cwd(), dir);
}

export const paths = {
    tmp: resolveDir(env.TEMP_DIR),
    work: resolveDir(env.WORK_DIR),
}

export const ensurePaths = () => {
    for (const dir of Object.values(paths)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    return paths;
}