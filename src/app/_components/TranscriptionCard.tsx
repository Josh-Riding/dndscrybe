"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import { downloadText } from "../lib/downloadText";
import { ArrowDownToLine, Clipboard } from "lucide-react";
import { format } from "date-fns";
import { api } from "@/trpc/react";

interface TranscriptionCardProps {
  transcription: any;
}

export default function TranscriptionCard({
  transcription,
}: TranscriptionCardProps) {
  const [title, setTitle] = useState(transcription.title);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const utils = api.useUtils();

  const editMutation = api.transcribe.edit.useMutation({
    onSuccess: () => {
      utils.invalidate(); // or utils.transcription.invalidate() if scoped
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    editMutation.mutate({
      id: transcription.id,
      title,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Summary copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="space-y-4 rounded-md border border-[#333] bg-[#1f1f1f] p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          {isEditing ? (
            <div ref={inputRef} className="flex items-center gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`rounded p-2 text-white ${
                  isEditing
                    ? "border-2 border-blue-500"
                    : "border border-[#2a2a2a]"
                }`}
              />
              <Button onClick={handleSave} className="text-white">
                Save
              </Button>
            </div>
          ) : (
            <h2
              className="cursor-pointer text-lg font-semibold text-white"
              onClick={() => setIsEditing(true)}
            >
              {title}
            </h2>
          )}

          <p className="text-sm text-gray-400">
            {format(new Date(transcription.createdAt), "MMMM d, yyyy h:mm a")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            className="rounded bg-[#333] px-3 py-1.5 text-sm text-white hover:bg-[#4a4a4a]"
            onClick={() =>
              downloadText(
                transcription.transcriptionText,
                `${transcription.title}.txt`,
              )
            }
          >
            Download Transcription
          </Button>
          <Button
            className="rounded bg-[#df2935] px-3 py-1.5 text-sm text-white hover:bg-[#b2222b]"
            onClick={() => setOpen(!open)}
          >
            {open ? "Hide Summary" : "Show Summary"}
          </Button>
        </div>
      </div>

      {open && transcription.summary && (
        <div className="mt-3 space-y-3 border-t border-[#2f2f2f] pt-3 text-[#cccccc]">
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {transcription.summary.summaryText}
          </p>
          <div className="flex w-fit items-center gap-3">
            <div className="group relative">
              <button
                aria-label="Download summary"
                onClick={() =>
                  downloadText(
                    transcription.summary.summaryText,
                    `${transcription.title}_summary.txt`,
                  )
                }
                className="rounded-full bg-[#333] p-2 text-white hover:bg-[#4a4a4a]"
              >
                <ArrowDownToLine className="h-5 w-5" />
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 transform rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                Download Summary
              </span>
            </div>

            <div className="group relative">
              <button
                aria-label="Copy summary"
                onClick={() => handleCopy(transcription.summary.summaryText)}
                className="rounded-full bg-[#333] p-2 text-white hover:bg-[#4a4a4a]"
              >
                <Clipboard className="h-5 w-5" />
              </button>
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 transform rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                Copy Summary
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
