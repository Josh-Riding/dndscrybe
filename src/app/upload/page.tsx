"use client";

import { siteConfig } from "@/config/site";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { noteTypeExamples } from "../lib/noteTypes";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

interface TranscriptionResponse {
  text: string;
  summary: string;
  error?: string;
  details?: string;
}
const uploadToS3 = async (
  file: File,
  getPresignedUrl: ReturnType<typeof api.audio.getPresignedUrl.useMutation>,
  notifyUploadComplete: ReturnType<
    typeof api.audio.notifyUploadComplete.useMutation
  >,
) => {
  const { url, key } = await getPresignedUrl.mutateAsync({
    filename: file.name,
  });

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!res.ok) {
    const text = await res.text(); // Get error details from response
    console.error("S3 upload failed:", text);
    throw new Error(`S3 upload failed: ${text}`);
  }

  await notifyUploadComplete.mutateAsync({ key });
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noteType, setNoteType] = useState("main");

  const getPresignedUrl = api.audio.getPresignedUrl.useMutation();
  const notifyUploadComplete = api.audio.notifyUploadComplete.useMutation();

  const router = useRouter();
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith("audio/")) {
      setFile(droppedFile);
    }
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave() {
    setDragActive(false);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type.startsWith("audio/")) {
      setFile(selectedFile);
    }
  }

  async function handleSubmit() {
    if (!file) return;
    setLoading(true);

    try {
      await uploadToS3(file, getPresignedUrl, notifyUploadComplete);
      router.push("/tbd?success=true");
    } catch (err) {
      console.error("Upload failed", err);
      setLoading(false);
    }
  }

  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-[#f5f5f5]">
        <p>Not authenticated</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#1e1e1e] px-4 py-16 text-[#f5f5f5]">
      <h1 className="mb-8 text-center font-serif text-4xl font-bold text-[#df2935] drop-shadow-md">
        Upload Your Session
      </h1>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full max-w-md rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          dragActive
            ? "border-[#df2935]/80 bg-[#2a2a2a]/80"
            : "border-[#3a3a3a] bg-[#2a2a2a]"
        }`}
      >
        <p className="mb-4 text-lg">
          {file ? `Selected: ${file.name}` : "Drag and drop your audio file"}
        </p>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer text-[#df2935] underline hover:text-[#b2222b]"
        >
          or click to select a file
        </label>
      </div>

      <select
        value={noteType}
        onChange={(e) => setNoteType(e.target.value)}
        className="mt-6 w-full max-w-md rounded-2xl border border-[#3a3a3a] bg-[#2a2a2a] p-3 text-[#f5f5f5] focus:border-[#df2935] focus:ring-1 focus:ring-[#df2935] focus:outline-none"
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
        onClick={handleSubmit}
        disabled={loading}
        className="mt-8 rounded-2xl bg-[#df2935] px-6 py-3 text-lg text-white shadow-lg transition hover:bg-[#b2222b] disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Begin Transcription"}
      </button>
    </div>
  );
}
