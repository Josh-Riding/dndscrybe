"use client";

import { siteConfig } from "@/config/site";
import { noteTypeExamples } from "../lib/noteTypes";
import { useState } from "react";
import Link from "next/link";

export default function UploadPagePreview() {
  const [noteType, setNoteType] = useState("main");

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#1e1e1e] px-4 py-16 text-[#f5f5f5]">
      <h1 className="mb-8 text-center font-serif text-4xl font-bold text-[#df2935] drop-shadow-md">
        Upload Your Session
      </h1>

      <div className="pointer-events-none w-full max-w-md rounded-2xl border-2 border-dashed border-[#3a3a3a] bg-[#2a2a2a] p-8 text-center opacity-50">
        <p className="mb-4 text-lg">Drag and drop your audio file</p>
        <div className="cursor-not-allowed text-[#df2935] underline">
          or click to select a file
        </div>
      </div>

      <select
        value={noteType}
        onChange={(e) => setNoteType(e.target.value)}
        className="mt-6 w-full max-w-md rounded-2xl border border-[#3a3a3a] bg-[#2a2a2a] p-3 text-[#f5f5f5]"
      >
        <option value="main">{siteConfig.name} Style</option>
        <option value="bulletJournal">Bullet Journal</option>
        <option value="narrative">Narrative</option>
      </select>

      <div className="mt-4 w-full max-w-md rounded-2xl bg-[#2a2a2a] p-4 text-sm text-[#cccccc] shadow-inner">
        <p className="mb-2 font-semibold text-[#f5f5f5]">Example Preview:</p>
        <pre className="whitespace-pre-wrap">{noteTypeExamples[noteType]}</pre>
      </div>

      <button
        disabled
        className="mt-8 cursor-not-allowed rounded-2xl bg-[#df2935] px-6 py-3 text-lg text-white opacity-50 shadow-lg"
      >
        Begin Transcription
      </button>

      <p className="mt-8 text-sm text-[#cccccc]">
        <Link
          href="/api/auth/signin"
          className="text-[#df2935] underline hover:text-[#b2222b]"
        >
          Log in
        </Link>{" "}
        to upload and transcribe your session
      </p>
    </div>
  );
}
