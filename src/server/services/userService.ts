// src/server/services/userService.ts

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export async function addCredits({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}) {
  await db
    .update(users)
    .set({
      availableCredits: sql`${users.availableCredits} + ${amount}`,
    })
    .where(eq(users.id, userId));
}
