import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { transcriptionSummary } from "@/server/db/schema";

export const summaryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ summary: z.string().min(1), id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(transcriptionSummary).values({
        id: input.id,
        summaryText: input.summary,
        createdById: ctx.session.user.id,
      });
    }),
});
