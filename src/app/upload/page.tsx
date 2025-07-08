"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Coins, Loader2 } from "lucide-react";

// interface TranscriptionResponse {
//   text: string;
//   summary: string;
//   error?: string;
//   details?: string;
// }
const uploadToS3 = async (
  file: File,
  getPresignedUrl: ReturnType<typeof api.audio.getPresignedUrl.useMutation>,
  notifyUploadComplete: ReturnType<
    typeof api.audio.notifyUploadComplete.useMutation
  >,
) => {
  const { url, key, id } = await getPresignedUrl.mutateAsync({
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
  return id;
};

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace("/"); // Redirect to home if not authenticated
    }
  }, [session, status, router]);

  const getPresignedUrl = api.audio.getPresignedUrl.useMutation();
  const notifyUploadComplete = api.audio.notifyUploadComplete.useMutation();
  const { data: remainingCredits, isLoading: isLoadingCredits } =
    api.user.getRemainingCredits.useQuery(undefined, {
      enabled: !!session,
    });

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
      const id = await uploadToS3(file, getPresignedUrl, notifyUploadComplete);
      router.push(`/upload-status/${id}`);
    } catch (err) {
      console.error("Upload failed", err);
      setLoading(false);
    }
  }
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-[#f5f5f5]">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#1e1e1e] px-4 py-16 text-[#f5f5f5]">
      <h1 className="mb-8 text-center font-serif text-4xl font-bold text-[#df2935] drop-shadow-md">
        Upload Your Session
      </h1>
      {!isLoadingCredits && remainingCredits !== undefined && (
        <>
          <div className="mx-auto mb-2 flex items-center gap-3 rounded-md bg-[#2d2d2d] px-4 py-2 text-sm text-blue-200 shadow-sm">
            <span className="font-medium text-blue-100">
              Credits Remaining:
            </span>
            <span className="font-semibold text-blue-300">
              {remainingCredits.creditsRemaining}
            </span>
          </div>

          {remainingCredits.creditsRemaining < 240 && (
            <a
              href="/purchase-credits"
              className="mb-4 flex animate-bounce items-center justify-center gap-2 text-sm font-medium text-[#df2935] underline hover:text-[#b2222b]"
            >
              <Coins className="h-4 w-4 text-[#df2935]" />
              Purchase more credits
            </a>
          )}
        </>
      )}

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
          accept=".m4a,audio/*"
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

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-8 rounded-2xl bg-[#df2935] px-6 py-3 text-lg text-white shadow-lg transition hover:bg-[#b2222b] disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Begin Transcription"
        )}
      </button>
    </div>
  );
}
