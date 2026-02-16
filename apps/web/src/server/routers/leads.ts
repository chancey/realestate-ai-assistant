import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const leadsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["NEW", "CONTACTED", "QUALIFIED", "SHOWING_SCHEDULED", "CLOSED"])
          .optional(),
        minScore: z.number().int().min(0).max(100).optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.lead.findMany({
        where: {
          agentId: ctx.session.user.id,
          ...(input.status ? { status: input.status } : {}),
          ...(input.minScore ? { score: { gte: input.minScore } } : {}),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { score: "desc" },
        include: {
          _count: { select: { replies: true, appointments: true } },
        },
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.lead.findFirstOrThrow({
        where: { id: input.id, agentId: ctx.session.user.id },
        include: {
          replies: {
            orderBy: { createdAt: "desc" },
            include: { post: { select: { platform: true } } },
          },
          appointments: { orderBy: { startTime: "desc" } },
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum([
          "NEW",
          "CONTACTED",
          "QUALIFIED",
          "SHOWING_SCHEDULED",
          "CLOSED",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lead.update({
        where: { id: input.id, agentId: ctx.session.user.id },
        data: { status: input.status },
      });
    }),

  updateScore: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        score: z.number().int().min(0).max(100),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.lead.update({
        where: { id: input.id, agentId: ctx.session.user.id },
        data: { score: input.score },
      });
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const [total, byStatus, avgScore] = await Promise.all([
      ctx.db.lead.count({
        where: { agentId: ctx.session.user.id },
      }),
      ctx.db.lead.groupBy({
        by: ["status"],
        where: { agentId: ctx.session.user.id },
        _count: true,
      }),
      ctx.db.lead.aggregate({
        where: { agentId: ctx.session.user.id },
        _avg: { score: true },
      }),
    ]);

    return { total, byStatus, avgScore: avgScore._avg.score ?? 0 };
  }),
});
