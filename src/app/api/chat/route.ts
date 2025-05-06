import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { chatMessages, transcriptions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { openai } from "@/app/lib/openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export async function POST(req: NextRequest) {
  const { transcriptionId, userInput } = await req.json();

  if (!transcriptionId || !userInput) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const [transcription] = await db
    .select()
    .from(transcriptions)
    .where(eq(transcriptions.id, transcriptionId));

  if (!transcription?.transcriptionText) {
    return NextResponse.json(
      { error: "Transcription not found" },
      { status: 404 },
    );
  }

  const systemPrompt = transcription.transcriptionText;

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a helpful assistant designed to process and interpret transcripts from tabletop role-playing game (TTRPG) sessions. 
      The transcript will be passed in as ${systemPrompt}. 
      Your job is to answer the user's questions using the content of the transcript. 
      Prioritize helping the user recall important events, decisions, character actions, or dialogue from the session. 
      If a question asks for clarification, summaries, or highlights, respond with clear and concise answers grounded in the transcript. 
      If the transcript is unclear or lacks the necessary detail, say “I don’t know” or “From what I could gather ..., 
      but the transcription is a little hazy.” Never make up or assume events not present in the transcript.`,
    },
    { role: "user", content: userInput },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  const assistantReply =
    response.choices?.[0]?.message?.content ?? "No response.";

  await db.insert(chatMessages).values([
    {
      sessionId: transcriptionId,
      role: "user",
      content: userInput,
    },
    {
      sessionId: transcriptionId,
      role: "assistant",
      content: assistantReply,
    },
  ]);

  const updatedMessages = await db
    .select({
      role: chatMessages.role,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, transcriptionId))
    .orderBy(chatMessages.createdAt);

  return NextResponse.json({ messages: updatedMessages });
}
