import { auth } from "@/server/auth";
import { db } from "@/server/db";
import ClientChatPage from "../_components/ClientChatPage";

export default async function ChatPage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] text-[#f5f5f5]">
        <p>Please log in to access the chat.</p>
      </div>
    );
  }

  const transcriptions = await db.query.transcriptions.findMany({
    where: (transcriptions, { eq }) =>
      eq(transcriptions.createdById, session.user.id),
    orderBy: (transcriptions, { desc }) => [desc(transcriptions.createdAt)],
  });

  return <ClientChatPage transcriptions={transcriptions} />;
}
