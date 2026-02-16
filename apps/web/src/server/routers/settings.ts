import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const settingsRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const [agent, settings] = await Promise.all([
      ctx.db.agent.findUnique({ where: { id: ctx.session.user.id } }),
      ctx.db.agentSettings.findUnique({
        where: { agentId: ctx.session.user.id },
      }),
    ]);

    return { agent, settings };
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        phone: z.string().optional(),
        brokerage: z.string().optional(),
        licenseNumber: z.string().optional(),
        timezone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.agent.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        defaultTone: z
          .enum(["luxury", "family", "investment", "starter"])
          .optional(),
        defaultLanguage: z.string().optional(),
        autoReplyEnabled: z.boolean().optional(),
        workingHoursStart: z.string().optional(),
        workingHoursEnd: z.string().optional(),
        workingDays: z.array(z.number().int().min(0).max(6)).optional(),
        bufferMinutes: z.number().int().min(0).max(120).optional(),
        mlsProvider: z.string().optional(),
        mlsApiKey: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.agentSettings.upsert({
        where: { agentId: ctx.session.user.id },
        create: {
          agentId: ctx.session.user.id,
          ...input,
        },
        update: input,
      });
    }),
});
