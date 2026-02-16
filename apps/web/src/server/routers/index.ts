import { createTRPCRouter } from "@/server/trpc";
import { listingsRouter } from "./listings";
import { contentRouter } from "./content";
import { postsRouter } from "./posts";
import { repliesRouter } from "./replies";
import { leadsRouter } from "./leads";
import { appointmentsRouter } from "./appointments";
import { socialAccountsRouter } from "./social-accounts";
import { settingsRouter } from "./settings";

export const appRouter = createTRPCRouter({
  listings: listingsRouter,
  content: contentRouter,
  posts: postsRouter,
  replies: repliesRouter,
  leads: leadsRouter,
  appointments: appointmentsRouter,
  socialAccounts: socialAccountsRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
