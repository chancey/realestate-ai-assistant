import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const listingsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["ACTIVE", "PENDING", "SOLD", "WITHDRAWN", "EXPIRED"])
          .optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.listing.findMany({
        where: {
          agentId: ctx.session.user.id,
          ...(input.status ? { status: input.status } : {}),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { content: true, posts: true } },
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
      return ctx.db.listing.findFirstOrThrow({
        where: { id: input.id, agentId: ctx.session.user.id },
        include: {
          content: { orderBy: { createdAt: "desc" } },
          posts: { orderBy: { createdAt: "desc" }, take: 10 },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        mlsId: z.string().optional(),
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1).max(2),
        zipCode: z.string().min(5),
        price: z.number().positive(),
        beds: z.number().int().min(0),
        baths: z.number().min(0),
        sqft: z.number().int().positive(),
        description: z.string().optional(),
        features: z.array(z.string()).default([]),
        photos: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.listing.create({
        data: {
          ...input,
          agentId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        address: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
        state: z.string().min(1).max(2).optional(),
        zipCode: z.string().min(5).optional(),
        price: z.number().positive().optional(),
        beds: z.number().int().min(0).optional(),
        baths: z.number().min(0).optional(),
        sqft: z.number().int().positive().optional(),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
        photos: z.array(z.string()).optional(),
        status: z
          .enum(["ACTIVE", "PENDING", "SOLD", "WITHDRAWN", "EXPIRED"])
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.listing.update({
        where: { id, agentId: ctx.session.user.id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.listing.delete({
        where: { id: input.id, agentId: ctx.session.user.id },
      });
    }),

  importFromMLS: protectedProcedure
    .input(z.object({ mlsId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // In production, fetch from MLS API using the agent's configured provider
      const settings = await ctx.db.agentSettings.findUnique({
        where: { agentId: ctx.session.user.id },
      });

      if (!settings?.mlsProvider || !settings?.mlsApiKey) {
        throw new Error(
          "MLS provider not configured. Please update your settings."
        );
      }

      // Placeholder: would use MLSClient to fetch data
      throw new Error(
        "MLS import not yet configured. Please add listing manually."
      );
    }),
});
