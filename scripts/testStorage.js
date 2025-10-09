import { Readable } from "node:stream";
import S3Storage from "../src/storage/s3Storage.js";

const s3 = new S3Storage({
  bucket: process.env.S3_BUCKET,
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const { key } = await s3.putObject(Readable.from("hello"), {
  prefix: "test",
  ext: ".txt",
  contentType: "text/plain",
  contentLength: 5,
});

const body = await s3.getObjectStream(key);
body.setEncoding("utf8");
let out = "";
for await (const chunk of body) out += chunk;
console.log("GET:", key, out);

await s3.deleteObject(key);
console.log("DELETE OK:", key);
