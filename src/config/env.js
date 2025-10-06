import dotenv, { parse } from "dotenv";

dotenv.config();

const parseRequired = (name) => {
    const value = process.env[name];

    if (value === undefined || value === "") {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

const parseNumber = (name, { defaultValue, required = false } = {}) => {
    const rawValue = process.env[name];

    if (rawValue === undefined || rawValue === "") {
        if (required) {
            throw new Error(`Missing required environment variable: ${name}`);
        }
        return defaultValue;
    }

    const parsed = Number(rawValue);
    if (Number.isNaN(parsed)) {
        throw new Error(`Invalid number for environment variable: ${name}`);
    }

    return parsed;
}

const parseBoolen = (name, { defaultValue, required = false } = {}) => {
    const rawValue = process.env[name];

    if (rawValue === undefined || rawValue === "") {
        if (required) {
            throw new Error(`Missing required environment variable: ${name}`);
        }
        return defaultValue;
    }

    if (["true", "1", "yes"].includes(rawValue.toLowerCase())) {
        return true;
    }

    if (["false", "0", "no"].includes(rawValue.toLowerCase())) {
        return false;
    }

    throw new Error(`Invalid boolean for environment variable: ${name}`);
}

const parseString = (name, { defaultValue, required = false } = {}) => {
    const rawValue = process.env[name];

    if (rawValue === undefined || rawValue === "") {
        if (required) {
            throw new Error(`Missing required environment variable: ${name}`);
        }
        return defaultValue;
    }
    
    return rawValue;
}

export const env = {
    PORT: parseNumber("PORT", { defaultValue: 3000 }),
    NODE_ENV: parseRequired("NODE_ENV"),
    TMP_DIR: parseString("TMP_DIR", { required: true }),
    WORK_DIR: parseString("WORK_DIR", { required: true }),
    UPLOAD_DIR: parseString("UPLOAD_DIR", { defaultValue: "uploads" }),
    MAX_FILE_SIZE: parseNumber("MAX_FILE_SIZE", { defaultValue: 104857600 }), // 100MB
}