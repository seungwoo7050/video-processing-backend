-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('UPLOADED', 'ANALYZING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('ANALYZE', 'THUMBNAIL', 'HLS');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "DerivativeType" AS ENUM ('THUMBNAIL', 'HLS');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "status" "VideoStatus" NOT NULL DEFAULT 'UPLOADED',
    "sourceObjectKey" TEXT NOT NULL,
    "durationMs" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "type" "JobType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER,
    "outTimeMs" INTEGER,
    "heartbeatAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "queueJobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Derivative" (
    "id" SERIAL NOT NULL,
    "videoId" INTEGER NOT NULL,
    "type" "DerivativeType" NOT NULL,
    "objectKey" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Derivative_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Video_ownerId_idx" ON "Video"("ownerId");

-- CreateIndex
CREATE INDEX "Video_status_idx" ON "Video"("status");

-- CreateIndex
CREATE INDEX "Job_videoId_idx" ON "Job"("videoId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_type_idx" ON "Job"("type");

-- CreateIndex
CREATE INDEX "Derivative_videoId_idx" ON "Derivative"("videoId");

-- CreateIndex
CREATE INDEX "Derivative_type_idx" ON "Derivative"("type");

-- AddForeignKey
ALTER TABLE "Video"
ADD CONSTRAINT "Video_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job"
ADD CONSTRAINT "Job_videoId_fkey"
FOREIGN KEY ("videoId") REFERENCES "Video"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Derivative"
ADD CONSTRAINT "Derivative_videoId_fkey"
FOREIGN KEY ("videoId") REFERENCES "Video"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
