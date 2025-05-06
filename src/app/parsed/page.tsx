import { db } from "@/server/db";
import { auth } from "@/server/auth";
import TranscriptionCard from "../_components/TranscriptionCard";

export default async function ParsedPage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-[#f5f5f5]">
        <p>Please log in to see your transcriptions.</p>
      </div>
    );
  }

  const transcriptions = await db.query.transcriptions.findMany({
    where: (transcriptions, { eq }) =>
      eq(transcriptions.createdById, session.user.id),
    orderBy: (transcriptions, { desc }) => [desc(transcriptions.createdAt)],
    with: {
      summary: true,
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#1e1e1e] text-[#f5f5f5]">
      <section className="relative bg-[#2a2a2a] px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-bold text-[#df2935]">
            Your Transcriptions
          </h1>
          <p className="mt-4 text-[#cccccc]">
            Review and download your recorded RPG sessions and summaries.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl space-y-6">
          {transcriptions.length === 0 ? (
            <div className="text-center text-[#cccccc]">
              No transcriptions found.
            </div>
          ) : (
            transcriptions.map((t) => (
              <TranscriptionCard key={t.id} transcription={t} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
