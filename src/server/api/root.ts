import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { transcriptionRouter } from "./routers/transcription";
import { summaryRouter } from "./routers/summary";
import { audioRouter } from "./routers/audio";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  audio: audioRouter,
  transcribe: transcriptionRouter,
  summarize: summaryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
