import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const repliesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        intent: z
          .enum([
            "INQUIRY",
            "SHOWING_REQUEST",
            "PRICE_QUESTION",
            "SPAM",
            "NEGOTIATION",
            "COMPLIMENT",
            "UNKNOWN",
          ])
          .optional(),
        responded: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.reply.findMany({
        where: {
          post: { agentId: ctx.session.user.id },
          ...(input.intent ? { intent: input.intent } : {}),
          ...(input.responded !== undefined
            ? { responded: input.responded }
            : {}),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          post: {
            select: { platform: true, listing: { select: { address: true } } },
          },
          lead: true,
        },
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  respond: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        responseBody: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // In production, send response via platform API
      return ctx.db.reply.update({
        where: { id: input.id },
        data: {
          responded: true,
          responseBody: input.responseBody,
        },
      });
    }),

  reclassify: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        intent: z.enum([
          "INQUIRY",
          "SHOWING_REQUEST",
          "PRICE_QUESTION",
          "SPAM",
          "NEGOTIATION",
          "COMPLIMENT",
          "UNKNOWN",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.reply.update({
        where: { id: input.id },
        data: { intent: input.intent },
      });
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const [total, unresponded, byIntent] = await Promise.all([
      ctx.db.reply.count({
        where: { post: { agentId: ctx.session.user.id } },
      }),
      ctx.db.reply.count({
        where: {
          post: { agentId: ctx.session.user.id },
          responded: false,
          intent: { not: "SPAM" },
        },
      }),
      ctx.db.reply.groupBy({
        by: ["intent"],
        where: { post: { agentId: ctx.session.user.id } },
        _count: true,
      }),
    ]);

    return { total, unresponded, byIntent };
  }),
});
