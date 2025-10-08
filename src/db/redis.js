import Redis from "ioredis";
import { env } from "../config/env.js";

const redis = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    connectTimeout: 500,
    maxRetriesPerRequest: 0,
    enableOfflineQueue: false,
    retryStrategy: () => null,
});

const withTimeout = (promise, timeoutMs) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
        reject(new Error("Redis ping timed out"));
    }, timeoutMs);

    promise.then((result) => {
        clearTimeout(timer);
        resolve(result);
    }).catch((error) => {
        clearTimeout(timer);
        reject(error);
    });
});

export const pingRedis = (timeoutMs = 500) => withTimeout(redis.ping(), timeoutMs);

export default redis;