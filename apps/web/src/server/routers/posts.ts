import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const postsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["DRAFT", "SCHEDULED", "PUBLISHING", "PUBLISHED", "FAILED"])
          .optional(),
        platform: z
          .enum(["FACEBOOK", "INSTAGRAM", "TIKTOK", "LINKEDIN", "X", "YOUTUBE"])
          .optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.post.findMany({
        where: {
          agentId: ctx.session.user.id,
          ...(input.status ? { status: input.status } : {}),
          ...(input.platform ? { platform: input.platform } : {}),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          listing: { select: { address: true, city: true } },
          _count: { select: { replies: true } },
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
      return ctx.db.post.findFirstOrThrow({
        where: { id: input.id, agentId: ctx.session.user.id },
        include: {
          listing: true,
          replies: {
            orderBy: { createdAt: "desc" },
            include: { lead: true },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        listingId: z.string().optional(),
        platform: z.enum([
          "FACEBOOK",
          "INSTAGRAM",
          "TIKTOK",
          "LINKEDIN",
          "X",
          "YOUTUBE",
        ]),
        content: z.string().min(1),
        mediaUrls: z.array(z.string()).default([]),
        scheduledAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          ...input,
          scheduledAt: input.scheduledAt
            ? new Date(input.scheduledAt)
            : undefined,
          status: input.scheduledAt ? "SCHEDULED" : "DRAFT",
          agentId: ctx.session.user.id,
        },
      });
    }),

  schedule: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        scheduledAt: z.string().datetime(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.update({
        where: { id: input.id, agentId: ctx.session.user.id },
        data: {
          scheduledAt: new Date(input.scheduledAt),
          status: "SCHEDULED",
        },
      });

      // In production, add to BullMQ for scheduled publishing
      // await publishQueue.add("publish-post", { postId: post.id }, {
      //   delay: new Date(input.scheduledAt).getTime() - Date.now(),
      // });

      return post;
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirstOrThrow({
        where: { id: input.id, agentId: ctx.session.user.id },
      });

      // In production, publish via OpenClaw social-publisher skill
      // For now, simulate publishing
      return ctx.db.post.update({
        where: { id: post.id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          platformPostId: `sim_${Date.now()}`,
        },
      });
    }),

  crossPost: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        platforms: z.array(
          z.enum([
            "FACEBOOK",
            "INSTAGRAM",
            "TIKTOK",
            "LINKEDIN",
            "X",
            "YOUTUBE",
          ])
        ),
        listingId: z.string().optional(),
        mediaUrls: z.array(z.string()).default([]),
        scheduledAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const posts = await Promise.all(
        input.platforms.map((platform) =>
          ctx.db.post.create({
            data: {
              listingId: input.listingId,
              platform,
              content: input.content,
              mediaUrls: input.mediaUrls,
              scheduledAt: input.scheduledAt
                ? new Date(input.scheduledAt)
                : undefined,
              status: input.scheduledAt ? "SCHEDULED" : "DRAFT",
              agentId: ctx.session.user.id,
            },
          })
        )
      );
      return posts;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.delete({
        where: { id: input.id, agentId: ctx.session.user.id },
      });
    }),

  getCalendar: protectedProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          agentId: ctx.session.user.id,
          scheduledAt: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        },
        orderBy: { scheduledAt: "asc" },
        include: {
          listing: { select: { address: true, city: true } },
        },
      });
    }),
});
