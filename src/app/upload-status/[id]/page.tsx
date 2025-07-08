"use client";

import { api } from "@/trpc/react";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type AudioStatus = {
  uploaded: boolean;
  processed: boolean;
  key: string;
  duration: number | null;
  filename: string;
};

export default function UploadStatusPage() {
  const { id } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    void fetch("/api/process-audio", {
      method: "POST",
    });
  }, []);

  const isValidId = typeof id === "string";

  const fetchOptions = {
    refetchInterval: (query: { state: { data?: AudioStatus } }) => {
      const data = query.state.data;
      const uploadDone = data?.uploaded ?? false;
      const processedDone = data?.processed ?? false;
      const hasDuration =
        data?.duration !== null && data?.duration !== undefined;
      const allComplete = uploadDone && processedDone && hasDuration;

      return allComplete ? false : 2000;
    },
  };

  const statusQuery = isValidId
    ? api.audio.getStatus.useQuery<AudioStatus>({ id }, fetchOptions)
    : { data: undefined, error: null, isLoading: false };

  const status = statusQuery.data;
  const error = statusQuery.error;
  const isLoading = statusQuery.isLoading;
  const requiredCredits = Math.floor(Number(status?.duration) / 60);

  const progress = !status
    ? 0
    : [status.uploaded, status.processed, status.duration !== null].filter(
        Boolean,
      ).length * 33.33;

  const { data: remainingCredits, isLoading: isLoadingCredits } =
    api.user.getRemainingCredits.useQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-[#f5f5f5]">
        <p className="text-lg tracking-wide">Loading status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-[#f5f5f5]">
        <p className="text-lg tracking-wide text-red-400">
          Error loading status: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1e1e1e] px-6 py-20 text-[#f5f5f5]">
      <h1 className="mb-8 font-serif text-4xl font-bold drop-shadow-md md:text-5xl">
        Upload Progress
      </h1>
      {!isLoadingCredits && remainingCredits !== undefined && (
        <div className="mx-auto mb-4 flex items-center gap-3 rounded-md bg-[#2d2d2d] px-4 py-2 text-sm text-blue-200 shadow-sm">
          <span className="font-medium text-blue-100">Credits Remaining:</span>
          <span className="font-semibold text-blue-300">
            {remainingCredits.creditsRemaining}
          </span>
        </div>
      )}

      <div className="mb-10 w-full max-w-xl">
        <div className="h-6 w-full overflow-hidden rounded-full bg-[#2a2a2a]">
          <div
            className="h-full rounded-full bg-[#df2935] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-center text-sm text-[#bbbbbb]">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Credits Needed - Card Style */}
      {status?.uploaded && status?.processed && status?.duration !== null && (
        <div className="mt-8 w-full max-w-md rounded-xl border border-green-400/20 bg-green-800/30 px-6 py-5 text-center text-green-100 shadow-lg backdrop-blur-md">
          <p className="text-lg font-semibold tracking-wide">
            Credits Needed:{" "}
            <span className="text-2xl font-bold text-green-200">
              {Math.floor(status.duration / 60)}
            </span>
          </p>
        </div>
      )}

      {status?.duration !== null &&
        remainingCredits !== undefined &&
        requiredCredits > remainingCredits.creditsRemaining && (
          <div className="mt-6 max-w-xl rounded-lg bg-yellow-900/50 px-6 py-5 text-center text-yellow-100 shadow-lg">
            <p className="mb-4 text-base font-medium">
              Your audio requires{" "}
              <span className="font-semibold text-yellow-200">
                {requiredCredits}
              </span>{" "}
              credits, but you only have{" "}
              <span className="font-semibold text-yellow-200">
                {remainingCredits.creditsRemaining}
              </span>{" "}
              remaining.
            </p>
            <button
              onClick={() => (window.location.href = "/purchase-credits")}
              className="rounded-md bg-yellow-500 px-5 py-2 text-sm font-semibold text-[#1e1e1e] shadow-md transition hover:bg-yellow-400"
            >
              Buy More Credits
            </button>
          </div>
        )}

      {status?.duration !== null &&
        remainingCredits !== undefined &&
        requiredCredits <= remainingCredits.creditsRemaining && (
          <button
            onClick={async () => {
              setIsProcessing(true);
              try {
                const res = await fetch("/api/transcribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id }),
                });

                if (res.ok) {
                  window.location.href = "/parsed";
                } else {
                  console.error("Transcription failed");
                  setIsProcessing(false);
                }
              } catch (err) {
                console.error(err);
                setIsProcessing(false);
              }
            }}
            disabled={isProcessing}
            className={`mt-6 rounded-md px-6 py-2 text-sm font-semibold text-[#1e1e1e] shadow-md transition ${
              isProcessing
                ? "cursor-not-allowed bg-green-800"
                : "bg-green-500 hover:bg-green-400"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Use My Credits and Continue"
            )}
          </button>
        )}
    </div>
  );
}
