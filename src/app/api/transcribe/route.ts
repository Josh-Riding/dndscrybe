import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import fs from "fs";
import { createClient } from "@deepgram/sdk";
import { api } from "@/trpc/server";
import { noteTypes } from "@/app/lib/noteTypes";
import { openai } from "@/app/lib/openai";
import { pullFileFromS3 } from "@/app/lib/s3ops";
import { fileTypeFromBuffer } from "file-type";

type DeepgramTranscriptionResult = {
  results?: {
    channels?: {
      alternatives?: {
        paragraphs?: {
          transcript: string;
        };
      }[];
    }[];
  };
};

type ErrorWithResponse = {
  response?: {
    text?: () => Promise<string>;
  };
};

export const dynamic = "force-dynamic";
const { DEEPGRAM_API_KEY } = process.env;

const deepgram = createClient(DEEPGRAM_API_KEY);

function formatTranscriptWithSpeakers(
  result: DeepgramTranscriptionResult,
): string {
  //any type
  const words =
    result?.results?.channels?.[0]?.alternatives?.[0]?.paragraphs?.transcript ??
    "";
  return words;
}

export async function POST(req: Request) {
  const body = await req.json();

  if (
    typeof body !== "object" ||
    body === null ||
    typeof body.id !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { id } = body;

  //find and stream to deepgram
  const fileStatus = await api.audio.getStatus({ id });
  const userCredits = await api.user.getRemainingCredits();

  if (!fileStatus.uploaded || !fileStatus.processed) {
    return NextResponse.json(
      {
        error: "Processing failed",
        details: "The file hasn't finished being processed into s3",
      },
      { status: 500 },
    );
  }

  const durationInMinutes = Math.floor((fileStatus.duration ?? 0) / 60);

  if (userCredits.creditsRemaining < durationInMinutes) {
    return NextResponse.json(
      {
        error: "Processing failed",
        details: "User doesn't have enough credits",
      },
      { status: 500 },
    );
  }

  const buffer = await pullFileFromS3(fileStatus.key);
  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType?.mime.startsWith("audio/")) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const fileName = fileStatus.filename;
  const filePath = path.join(tmpdir(), `${Date.now()}-${fileName}`);
  await writeFile(filePath, buffer);

  const stream = fs.createReadStream(filePath);

  try {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      stream,
      {
        model: "nova-3",
        smart_format: true,
        punctuate: true,
        language: "en-US",
        diarize: true, // 🔥 enables speaker tracking
      },
    );

    if (error) throw error;

    const transcriptionText = formatTranscriptWithSpeakers(result);
    console.log("i got here");
    const created = await api.transcribe.create({
      transcription: transcriptionText,
      title: fileName,
      id,
    });
    console.log("i got here again");
    if (!created) {
      throw new Error("Failed to create transcription");
    }

    const summaryRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are a helpful assistant that summarizes transcriptions of TTRPG sessions.

Your job is to extract the most important events, decisions, discoveries, and jokes from the session and present them in a concise summary for both players and the Game Master (GM).

Use this exact format and tone as how to structure the summary:

---

${noteTypes.main}

---
Be concise, avoid restating everything, and focus only on what players will want to remember later.
`.trim(),
        },
        {
          role: "user",
          content: `Please summarize the following transcription:\n\n${transcriptionText}`,
        },
      ],
    });

    const summary = summaryRes.choices[0]?.message.content ?? "";

    await api.summarize.create({ id, summary: summary });

    //take away the credits boys
    await api.user.removeCredits({ amount: durationInMinutes });

    return NextResponse.json({
      text: transcriptionText,
      summary,
    });
  } catch (err: unknown) {
    console.error("[API] Processing failed:", err);

    if (typeof err === "object" && err !== null && "response" in err) {
      const errorWithResponse = err as ErrorWithResponse;

      try {
        const errorText = await errorWithResponse.response?.text?.();
        console.error("[DEEPGRAM ERROR]", errorText);
      } catch (e) {
        console.warn("Failed to log Deepgram error:", e);
      }
    }

    return NextResponse.json(
      {
        error: "Processing failed",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
