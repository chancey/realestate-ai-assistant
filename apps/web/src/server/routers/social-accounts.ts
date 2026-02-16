import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const socialAccountsRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.socialAccount.findMany({
      where: { agentId: ctx.session.user.id },
      orderBy: { platform: "asc" },
    });
  }),

  connect: protectedProcedure
    .input(
      z.object({
        platform: z.enum([
          "FACEBOOK",
          "INSTAGRAM",
          "TIKTOK",
          "LINKEDIN",
          "X",
          "YOUTUBE",
        ]),
        accountId: z.string(),
        accountName: z.string(),
        accessToken: z.string(),
        refreshToken: z.string().optional(),
        tokenExpiry: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.socialAccount.upsert({
        where: {
          agentId_platform_accountId: {
            agentId: ctx.session.user.id,
            platform: input.platform,
            accountId: input.accountId,
          },
        },
        create: {
          ...input,
          tokenExpiry: input.tokenExpiry
            ? new Date(input.tokenExpiry)
            : undefined,
          agentId: ctx.session.user.id,
        },
        update: {
          accessToken: input.accessToken,
          refreshToken: input.refreshToken,
          tokenExpiry: input.tokenExpiry
            ? new Date(input.tokenExpiry)
            : undefined,
          accountName: input.accountName,
          isActive: true,
        },
      });
    }),

  disconnect: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.socialAccount.update({
        where: { id: input.id, agentId: ctx.session.user.id },
        data: { isActive: false },
      });
    }),

  refreshToken: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const account = await ctx.db.socialAccount.findFirstOrThrow({
        where: { id: input.id, agentId: ctx.session.user.id },
      });

      // In production, refresh the token via platform OAuth
      // Each platform has different refresh mechanisms
      if (!account.refreshToken) {
        throw new Error("No refresh token available. Please reconnect.");
      }

      // Placeholder: would call platform-specific token refresh
      return account;
    }),
});
