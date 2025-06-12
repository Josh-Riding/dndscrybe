import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { users } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  getRemainingCredits: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        availableCredits: true,
      },
    });

    return { creditsRemaining: user?.availableCredits ?? 0 };
  }),

  removeCredits: protectedProcedure
    .input(z.object({ amount: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const updatedRows = await ctx.db
        .update(users)
        .set({
          availableCredits: sql`${users.availableCredits} - ${input.amount}`,
        })
        .where(eq(users.id, ctx.session.user.id))
        .returning(); // Ensure this line is present to get the updated rows

      if (updatedRows.length === 0) {
        throw new Error("Failed to deduct credits");
      }

      return { success: true };
    }),
});
