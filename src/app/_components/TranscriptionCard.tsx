"use client";
import { useState } from "react";
import { ArrowDownToLine, Eye, Pencil } from "lucide-react";
import { format } from "date-fns";
import { downloadText } from "../lib/downloadText";
import { api } from "@/trpc/react";
import Modal from "./Modal";

export default function TranscriptionCard({
  transcription,
}: {
  transcription: any;
}) {
  const [title, setTitle] = useState(transcription.title);
  const [isEditing, setIsEditing] = useState(false);
  const [viewType, setViewType] = useState<null | "transcription" | "summary">(
    null,
  );

  const utils = api.useUtils();
  const editMutation = api.transcribe.edit.useMutation({
    onSuccess: () => {
      utils.invalidate();
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    editMutation.mutate({ id: transcription.id, title });
  };

  // const handleCopy = (text: string) => {
  //   navigator.clipboard.writeText(text).then(() => {
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   });
  // };

  return (
    <div className="flex flex-col gap-6 rounded-md border border-[#333] bg-[#1f1f1f] p-6 shadow-md md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="w-full rounded border-2 border-blue-500 bg-transparent p-2 text-white md:w-auto"
            autoFocus
          />
        ) : (
          <h2
            className="group flex cursor-pointer items-center gap-2 text-xl font-semibold text-white"
            onClick={() => setIsEditing(true)}
          >
            {title}
            <Pencil className="h-5 w-5 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </h2>
        )}
        <p className="text-sm text-gray-400">
          {format(new Date(transcription.createdAt), "MMM d, yyyy h:mm a")}
        </p>
      </div>

      <div className="flex flex-wrap gap-6 text-white md:justify-end">
        <Section
          label="Transcription"
          onDownload={() =>
            downloadText(
              transcription.transcriptionText,
              `${title.replaceAll(" ", "_").toLowerCase()}_transcription.txt`,
            )
          }
          onView={() => setViewType("transcription")}
        />

        {transcription.summary?.summaryText && (
          <Section
            label="Summary"
            onDownload={() =>
              downloadText(
                transcription.summary.summaryText,
                `${title.replaceAll(" ", "_").toLowerCase()}_summary.txt`,
              )
            }
            onView={() => setViewType("summary")}
          />
        )}
      </div>

      <Modal
        isOpen={viewType !== null}
        onClose={() => setViewType(null)}
        title={viewType === "transcription" ? "Transcription" : "Summary"}
        content={
          viewType === "transcription"
            ? transcription.transcriptionText
            : transcription.summary?.summaryText
        }
      />
    </div>
  );
}

function Section({
  label,
  onDownload,
  onView,
}: {
  label: string;
  onDownload: () => void;
  onView: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onDownload}
        className="flex items-center gap-2 text-sm font-medium text-blue-400 underline hover:text-blue-300"
        title={`Download ${label.toLowerCase()}`}
      >
        <ArrowDownToLine className="h-4 w-4" />
        {label}
      </button>
      <IconButton
        icon={<Eye strokeWidth=".5" className="h-5 w-5" />}
        label="View"
        onClick={onView}
      />
    </div>
  );
}

function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-full p-2 transition hover:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <div className="text-gray-400 group-hover:text-white">{icon}</div>
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 scale-0 transform rounded bg-black/80 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-md transition-all group-hover:scale-100 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}
