import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { pgEnum } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `dnd-scribe_${name}`);
export const roleEnum = pgEnum("role", ["user", "assistant"]);
export const userTierEnum = pgEnum("user_tier", [
  "free",
  "paid",
  "unlimited",
  "admin",
]);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),

  tier: userTierEnum("user_tier").default("free").notNull(),
  availableCredits: d.integer("available_credits").default(120).notNull(),
}));

export const usageLog = createTable("usage_log", (d) => ({
  id: d.serial().primaryKey(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  type: d.varchar({ length: 50 }).notNull(), // "transcription" | "chat"
  tokensUsed: d.integer().default(0),
  minutesUsed: d.integer().default(0),
  createdAt: d.timestamp({ withTimezone: true }).defaultNow(),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const transcriptions = createTable("transcriptions", (d) => ({
  id: d.varchar({ length: 255 }).primaryKey(),
  title: d.varchar({ length: 256 }),
  transcriptionText: d.text(),
  createdById: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const transcriptionSummary = createTable(
  "transcription_summaries",
  (d) => ({
    id: d.text().primaryKey(),
    summaryText: d.text(),
    createdById: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
);

export const transcriptionsRelations = relations(transcriptions, ({ one }) => ({
  summary: one(transcriptionSummary, {
    fields: [transcriptions.id],
    references: [transcriptionSummary.id],
  }),
}));

export const chatMessages = createTable("chat_messages", (d) => ({
  id: d.serial().primaryKey(),
  sessionId: d
    .text()
    .notNull()
    .references(() => transcriptions.id, { onDelete: "cascade" }),
  role: roleEnum("role").notNull(),
  content: d.text().notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const audioUpload = createTable("audio_upload", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: d
    .varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id),
  key: d.text("key").notNull().unique(),
  filename: d.text("filename").notNull(),
  processed: d.boolean("processed").default(false).notNull(),
  uploaded: d.boolean("uploaded").default(false).notNull(),
  duration: d.integer("duration"),
  createdAt: d.timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: d.timestamp("updated_at", { withTimezone: true }).defaultNow(),
}));

export const audioUploadRelations = relations(audioUpload, ({ one }) => ({
  user: one(users, {
    fields: [audioUpload.userId],
    references: [users.id],
  }),
}));

export const processedStripeEvents = createTable(
  "processed_stripe_events",
  (d) => ({
    id: d.text("id").primaryKey(),
    processedAt: d.timestamp("processed_at").defaultNow(),
  }),
);
