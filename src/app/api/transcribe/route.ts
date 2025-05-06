import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import fs from "fs";
import { createClient } from "@deepgram/sdk";
import { api } from "@/trpc/server";
import { noteTypes } from "@/app/lib/noteTypes";
import { openai } from "@/app/lib/openai";

export const dynamic = "force-dynamic";
const { DEEPGRAM_API_KEY } = process.env;

const deepgram = createClient(DEEPGRAM_API_KEY);

function formatTranscriptWithSpeakers(result: any): string {
  const words =
    result?.results?.channels?.[0]?.alternatives?.[0]?.paragraphs?.transcript ||
    [];
  return words;
}

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;
  const userChoice = data.get("noteType") as keyof typeof noteTypes;

  if (!file || file.type.split("/")[0] !== "audio") {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(tmpdir(), `${Date.now()}-${file.name}`);
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

    const created = await api.transcribe.create({
      transcription: transcriptionText,
      title: file.name,
    });

    if (!created) {
      throw new Error("Failed to create transcription");
    }

    const transcriptionId = created.id;

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

${noteTypes[userChoice]}

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

    await api.summarize.create({ id: transcriptionId, summary: summary });

    return NextResponse.json({
      text: transcriptionText,
      summary,
    });
  } catch (err: unknown) {
    console.error("[API] Processing failed:", err);

    if (
      err &&
      typeof err === "object" &&
      "response" in err &&
      (err as any).response
    ) {
      try {
        const errorText = await (err as any).response.text();
        console.error("[DEEPGRAM ERROR]", errorText);
      } catch (e) {}
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
