import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { transcriptions, chatMessages } from "@/server/db/schema";
import { eq, and, asc } from "drizzle-orm";

export const transcriptionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        transcription: z.string().min(1),
        title: z.string().min(1),
        id: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [inserted] = await ctx.db
        .insert(transcriptions)
        .values({
          title: input.title,
          transcriptionText: input.transcription,
          createdById: ctx.session.user.id,
          id: input.id,
        })
        .returning();

      return inserted;
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(transcriptions)
        .set({ title: input.title })
        .where(
          and(
            eq(transcriptions.id, input.id),
            eq(transcriptions.createdById, ctx.session.user.id),
          ),
        )
        .returning({ id: transcriptions.id, title: transcriptions.title });

      return updated;
    }),

  getMessagesByTranscriptionId: protectedProcedure
    .input(z.object({ transcriptionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          role: chatMessages.role,
          content: chatMessages.content,
          createdAt: chatMessages.createdAt,
        })
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, input.transcriptionId))
        .orderBy(asc(chatMessages.createdAt));
    }),
});
