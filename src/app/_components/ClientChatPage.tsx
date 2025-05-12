"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { useEffect } from "react";

export default function ClientChatPage({
  transcriptions,
}: {
  transcriptions: {
    id: number;
    createdById: string;
    createdAt: Date;
    title: string | null;
    transcriptionText: string | null;
  }[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messagesById, setMessagesById] = useState<
    Record<string, { role: "user" | "assistant"; content: string }[]>
  >({});

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesQuery = api.transcribe.getMessagesByTranscriptionId.useQuery(
    { transcriptionId: Number(selectedId) },
    {
      enabled: !!selectedId,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (messagesQuery.data && selectedId) {
      setMessagesById((prev) => ({
        ...prev,
        [selectedId]: messagesQuery.data.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }));
    }
  }, [messagesQuery.data, selectedId]);

  const messages = selectedId ? (messagesById[selectedId] ?? []) : [];

  const handleSubmit = async () => {
    if (!input.trim() || !selectedId) return;

    const newUserMessage = { role: "user" as const, content: input };
    setMessagesById((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newUserMessage],
    }));
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcriptionId: Number(selectedId),
          userInput: input,
        }),
      });

      const data: {
        error?: string;
        messages: { role: "user" | "assistant"; content: string }[];
      } = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

      setMessagesById((prev) => ({
        ...prev,
        [selectedId]: data.messages,
      }));
    } catch (err) {
      console.error(err);
      const errorMessage = {
        role: "assistant" as const,
        content: "An error occurred while processing your request.",
      };
      setMessagesById((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] ?? []), errorMessage],
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#1e1e1e] text-[#f5f5f5] md:flex-row">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="border-b border-[#333] bg-[#2a2a2a] p-4 text-left font-bold text-[#df2935] md:hidden"
      >
        {sidebarOpen ? "Close" : "Transcripts"}
      </button>

      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } w-full border-r border-[#333] bg-[#2a2a2a] p-4 md:block md:w-64`}
      >
        <h2 className="mb-4 text-xl font-bold text-[#df2935]">
          Your Transcripts
        </h2>
        <ul className="space-y-2">
          {transcriptions.map((t) => (
            <li
              key={t.id}
              className={`cursor-pointer rounded-md px-3 py-2 text-sm ${
                selectedId === String(t.id)
                  ? "bg-[#df2935] text-white"
                  : "hover:bg-[#3a3a3a]"
              }`}
              onClick={() => {
                setSelectedId(String(t.id));
                setSidebarOpen(false);
              }}
            >
              {t.title}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="border-b border-[#333] bg-[#2a2a2a] p-4 text-center">
          <h1 className="text-sm text-[#999] italic md:text-base">
            {selectedId
              ? `Chatting with ${transcriptions.find((t) => String(t.id) === selectedId)?.title}`
              : "Select a transcription"}
          </h1>
        </header>

        <section className="flex flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
            {messagesQuery.isLoading && (
              <div className="text-center text-sm text-[#888]">
                Loading messages...
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-xl rounded-xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-[#df2935] text-white"
                    : "mr-auto border border-[#444] bg-[#2a2a2a] text-[#cccccc]"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <form
            className="sticky bottom-0 border-t border-[#333] bg-[#1e1e1e] p-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                className="w-full rounded-xl border border-[#444] bg-[#2a2a2a] px-4 py-2 text-sm text-white placeholder-[#888] focus:outline-none"
                placeholder="Ask your transcription..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className={`rounded-xl px-4 py-2 text-sm text-white ${
                  loading
                    ? "cursor-not-allowed bg-[#888]"
                    : "bg-[#df2935] hover:bg-[#b2222b]"
                }`}
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
