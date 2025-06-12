import { db } from "@/server/db"; // your drizzle instance
import { audioUpload } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { parseBuffer } from "music-metadata";
import { env } from "@/env";
import type { Readable } from "stream";

const s3 = new S3Client({
  region: "us-west-2",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: Request) {
  const unprocessed = await db
    .select()
    .from(audioUpload)
    .where(
      and(eq(audioUpload.processed, false), eq(audioUpload.uploaded, true)),
    )
    .limit(5);

  if (unprocessed.length === 0) {
    return Response.json({ message: "Nothing to process" });
  }

  const results = [];

  for (const file of unprocessed) {
    try {
      const duration = await extractDurationFromS3(file.key);
      const roundedUp = Math.ceil(duration);
      await db
        .update(audioUpload)
        .set({
          duration: roundedUp,
          processed: true,
        })
        .where(eq(audioUpload.id, file.id));

      results.push({ key: file.key, success: true, duration: roundedUp });
    } catch (err) {
      console.error(`Failed to process ${file.key}:`, err);
      results.push({ key: file.key, success: false });
    }
  }

  return Response.json({ results });
}

async function extractDurationFromS3(s3key: string): Promise<number> {
  const cmd = new GetObjectCommand({
    Bucket: env.S3_AUDIO_BUCKET,
    Key: s3key,
  });

  const { Body } = await s3.send(cmd);
  const buffer = await streamToBuffer(Body as Readable);
  const metadata = await parseBuffer(buffer, s3key);

  return metadata.format.duration ?? 0;
}

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
