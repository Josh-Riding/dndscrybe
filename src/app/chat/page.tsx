import { auth } from "@/server/auth";
import { db } from "@/server/db";
import ClientChatPage from "../_components/ClientChatPage";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const transcriptions = await db.query.transcriptions.findMany({
    where: (transcriptions, { eq }) =>
      eq(transcriptions.createdById, session.user.id),
    orderBy: (transcriptions, { desc }) => [desc(transcriptions.createdAt)],
  });

  return <ClientChatPage transcriptions={transcriptions} />;
}
