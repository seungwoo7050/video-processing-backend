import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.js";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const withTimeout = (promise, timeoutMs) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    reject(new Error("Database ping timed out"));
  }, timeoutMs);

  promise.then((result) => {
    clearTimeout(timer);
    resolve(result);
  }).catch((error) => {
    clearTimeout(timer);
    reject(error);
  });
});

export const pingDatabase = (timeoutMs = 500) => withTimeout(
  prisma.$queryRaw`SELECT 1`,
  timeoutMs
);

export default prisma;