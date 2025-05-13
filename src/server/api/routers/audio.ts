import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid"; // Still using nanoid for random string generation
import { z } from "zod";
import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { audioUpload } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

const s3Client = new S3Client({
  region: "us-west-2", // Adjust to your region
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
const mimeMap: Record<string, string> = {
  mp3: "audio/mpeg", // MP3 audio
  mp4: "video/mp4", // MP4 video
  mp2: "audio/mpeg", // MP2 audio (similar to MP3)
  aac: "audio/aac", // AAC audio
  wav: "audio/wav", // WAV audio
  flac: "audio/flac", // FLAC audio
  pcm: "audio/pcm", // PCM audio (raw audio format)
  m4a: "audio/mp4", // M4A audio (typically AAC encoded)
  ogg: "audio/ogg", // OGG audio
  opus: "audio/opus", // Opus audio
  webm: "video/webm", // WebM video (can contain audio as well)
};

export const audioRouter = createTRPCRouter({
  getPresignedUrl: protectedProcedure
    .input(z.object({ filename: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const key = `audio/${userId}/${Date.now()}-${nanoid()}-${input.filename}`;

      const extension = input.filename.split(".").pop()?.toLowerCase();
      const contentType =
        mimeMap[extension ?? ""] ?? "application/octet-stream";

      const command = new PutObjectCommand({
        Bucket: env.S3_AUDIO_BUCKET,
        Key: key,
        ContentType: contentType,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

      await ctx.db.insert(audioUpload).values({
        key,
        userId,
        status: "pending",
      });

      return { url, key };
    }),

  notifyUploadComplete: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { key } = input;
      const userId = ctx.session.user.id;

      const [upload] = await ctx.db
        .select()
        .from(audioUpload)
        .where(and(eq(audioUpload.key, key), eq(audioUpload.userId, userId)));

      if (!upload) throw new Error("Upload not found");

      //custom stuff here for minutes
      await ctx.db
        .update(audioUpload)
        .set({ status: "uploaded" })
        .where(eq(audioUpload.id, upload.id));

      return { success: true };
    }),
});
