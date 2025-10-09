// src/storage/s3Storage.js
import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "node:stream";
import crypto from "node:crypto";
import Storage from "./storage.js";

function normalizeEndpoint(endpoint) {
  if (!endpoint) return undefined;
  const e = String(endpoint).trim();
  if (!e) return undefined;
  if (/^https?:\/\//i.test(e)) return e;
  return `http://${e}`;
}

function buildRangeHeader(range) {
  if (!range) return undefined;

  const { start, end } = range;
  const hasStart = Number.isInteger(start);
  const hasEnd = Number.isInteger(end);

  if (!hasStart && !hasEnd) return undefined;
  if (hasStart && start < 0) throw new Error("Invalid range.start");
  if (hasEnd && end < 0) throw new Error("Invalid range.end");
  if (hasStart && hasEnd && start > end) throw new Error("Invalid range: start > end");

  if (hasStart) return `bytes=${start}-${hasEnd ? end : ""}`;
  return `bytes=0-${end}`;
}

function toNodeReadable(body) {
  if (!body) throw new Error("S3Storage: empty body");
  if (body instanceof Readable) return body;
  if (typeof body.pipe === "function") return body;

  if (typeof body.getReader === "function") {
    if (typeof Readable.fromWeb === "function") return Readable.fromWeb(body);

    const reader = body.getReader();
    return Readable.from(
      (async function* () {
        while (true) {
          const { done, value } = await reader.read();
          if (done) return;
          yield Buffer.from(value);
        }
      })(),
    );
  }

  throw new Error("S3Storage: unsupported body type");
}

class S3Storage extends Storage {
  constructor({ bucket, region, endpoint, forcePathStyle = true, credentials }) {
    super();
    if (!bucket) throw new Error("S3Storage: bucket is required");
    if (!region) throw new Error("S3Storage: region is required");

    this.bucket = bucket;

    const normalizedEndpoint = normalizeEndpoint(endpoint);

    this.client = new S3Client({
      region,
      endpoint: normalizedEndpoint,
      forcePathStyle,
      ...(credentials ? { credentials } : {}),
    });
  }

  async putObject(stream, options = {}) {
    if (!stream) throw new Error("S3Storage.putObject: stream is required");

    const key =
      options.key ??
      `${options.prefix ?? "objects"}/${crypto.randomUUID()}${options.ext ? String(options.ext) : ""}`;

    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: stream,
      ...(options.contentType ? { ContentType: options.contentType } : {}),
      ...(Number.isFinite(options.contentLength) ? { ContentLength: options.contentLength } : {}),
    };

    const upload = new Upload({ client: this.client, params });
    const result = await upload.done();

    return { key, etag: result?.ETag };
  }

  async getObjectStream(key, range) {
    if (!key) throw new Error("S3Storage.getObjectStream: key is required");

    const params = { Bucket: this.bucket, Key: key };
    const rangeHeader = buildRangeHeader(range);
    if (rangeHeader) params.Range = rangeHeader;

    const response = await this.client.send(new GetObjectCommand(params));
    return toNodeReadable(response.Body);
  }

  async deleteObject(key) {
    if (!key) throw new Error("S3Storage.deleteObject: key is required");

    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}

export default S3Storage;
