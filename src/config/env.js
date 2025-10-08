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

const parseUrlString = (name, { defaultValue, required = false } = {}) => {
    const rawValue = parseString(name, { defaultValue, required });
    if (rawValue === undefined) {
        return rawValue;
    }
    try {
        new URL(rawValue);
    } catch {
        throw new Error(`Invalid URL for environment variable: ${name}`);
    }
    return rawValue;
}

const parseSecret = (name, { required = false, minLength = 32, forbid = ["changeme", "secret", "dev-secret"]}) => {
  const value = parseString(name, { required });

  if (value === undefined) {
    return value;
  }

  if (value.length < minLength) {
    throw new Error(`Invalid secret for environment variable: ${name} must be at least ${minLength}`);
  }
  
  if (forbid.includes(value.toLowerCase())) {
    throw new Error(`Invalid secret for environment variable: ${name} is too weak`);
  }

  return value;
}

export const env = {
    PORT: parseNumber("PORT", { defaultValue: 3000 }),
    NODE_ENV: parseRequired("NODE_ENV"),
    TMP_DIR: parseString("TMP_DIR", { required: true }),
    WORK_DIR: parseString("WORK_DIR", { required: true }),
    UPLOAD_DIR: parseString("UPLOAD_DIR", { defaultValue: "uploads" }),
    MAX_FILE_SIZE: parseNumber("MAX_FILE_SIZE", { defaultValue: 104857600 }), // 100MB
    DATABASE_URL: parseUrlString("DATABASE_URL", { required: true }),
    REDIS_URL: parseUrlString("REDIS_URL", { required: true }),
    S3_ENDPOINT: parseUrlString("S3_ENDPOINT", { required: true }),
    S3_ACCESS_KEY: parseString("S3_ACCESS_KEY", { required: true }),
    S3_SECRET_KEY: parseString("S3_SECRET_KEY", { required: true }),
    S3_BUCKET: parseString("S3_BUCKET", { required: true }),
    S3_REGION: parseString("S3_REGION", { defaultValue: "us-east-1" }),
    JWT_SECRET: parseSecret("JWT_SECRET", { required: true, minLength: 32 }),
    JWT_EXPIRES_IN: parseString("JWT_EXPIRES_IN", { required: true }),
}