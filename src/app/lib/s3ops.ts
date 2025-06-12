import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/env";
import type { Readable } from "stream";

const s3 = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function pullFileFromS3(s3key: string): Promise<Buffer> {
  const cmd = new GetObjectCommand({
    Bucket: env.S3_AUDIO_BUCKET,
    Key: s3key,
  });

  const { Body } = await s3.send(cmd);
  const buffer = await streamToBuffer(Body as Readable);
  return buffer;
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
