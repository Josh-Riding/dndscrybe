"use client";
import { useState } from "react";
import { EllipsisVertical, Pencil } from "lucide-react";
import { Menu } from "@headlessui/react";
import { format } from "date-fns";
import { downloadText } from "../lib/downloadText";
import { api } from "@/trpc/react";
import Modal from "./Modal";

export default function TranscriptionCard({
  transcription,
}: {
  transcription: {
    id: string;
    title: string;
    createdAt: string;
    transcriptionText: string;
    summary: { summaryText: string };
  };
}) {
  const [title, setTitle] = useState(transcription.title);
  const [isEditing, setIsEditing] = useState(false);
  const [viewType, setViewType] = useState<null | "transcription" | "summary">(
    null,
  );

  const utils = api.useUtils();
  const editMutation = api.transcribe.edit.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    editMutation.mutate({ id: transcription.id, title });
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-md border border-[#333] bg-[#1f1f1f] p-4 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start justify-between sm:flex-1 sm:items-center">
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

        <Menu as="div" className="relative">
          <Menu.Button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <EllipsisVertical className="h-5 w-5 text-white" />
          </Menu.Button>

          <Menu.Items className="ring-opacity-5 absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-[#2a2a2a] shadow-lg ring-1 ring-black focus:outline-none">
            <div className="p-1 text-sm text-white">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setViewType("transcription")}
                    className={`w-full px-4 py-2 text-left ${
                      active ? "bg-[#3a3a3a]" : ""
                    }`}
                  >
                    View Transcription
                  </button>
                )}
              </Menu.Item>
              {transcription.summary?.summaryText && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setViewType("summary")}
                      className={`w-full px-4 py-2 text-left ${
                        active ? "bg-[#3a3a3a]" : ""
                      }`}
                    >
                      View Summary
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() =>
                      downloadText(
                        transcription.transcriptionText,
                        `${title.replaceAll(" ", "_").toLowerCase()}_transcription.txt`,
                      )
                    }
                    className={`w-full px-4 py-2 text-left ${
                      active ? "bg-[#3a3a3a]" : ""
                    }`}
                  >
                    Download Transcription
                  </button>
                )}
              </Menu.Item>
              {transcription.summary?.summaryText && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        downloadText(
                          transcription.summary.summaryText,
                          `${title.replaceAll(" ", "_").toLowerCase()}_summary.txt`,
                        )
                      }
                      className={`w-full px-4 py-2 text-left ${
                        active ? "bg-[#3a3a3a]" : ""
                      }`}
                    >
                      Download Summary
                    </button>
                  )}
                </Menu.Item>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`w-full px-4 py-2 text-left ${
                      active ? "bg-[#3a3a3a]" : ""
                    }`}
                  >
                    Rename
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => console.log("Delete clicked")}
                    className={`w-full px-4 py-2 text-left text-red-400 ${
                      active ? "bg-[#3a3a3a]" : ""
                    }`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>

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
    </div>
  );
}
