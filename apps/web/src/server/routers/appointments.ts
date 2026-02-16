import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const appointmentsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        status: z
          .enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"])
          .optional(),
        upcoming: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.appointment.findMany({
        where: {
          lead: { agentId: ctx.session.user.id },
          ...(input.status ? { status: input.status } : {}),
          ...(input.upcoming ? { startTime: { gte: new Date() } } : {}),
        },
        take: input.limit,
        orderBy: { startTime: "asc" },
        include: {
          lead: { select: { name: true, email: true, phone: true } },
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        leadId: z.string(),
        listingId: z.string().optional(),
        type: z.string(),
        startTime: z.string().datetime(),
        endTime: z.string().datetime(),
        location: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify lead belongs to agent
      await ctx.db.lead.findFirstOrThrow({
        where: { id: input.leadId, agentId: ctx.session.user.id },
      });

      const appointment = await ctx.db.appointment.create({
        data: {
          ...input,
          startTime: new Date(input.startTime),
          endTime: new Date(input.endTime),
        },
      });

      // Update lead status
      await ctx.db.lead.update({
        where: { id: input.leadId },
        data: { status: "SHOWING_SCHEDULED" },
      });

      // In production: create Google Calendar event, send confirmation
      return appointment;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.appointment.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  getAvailability: protectedProcedure
    .input(
      z.object({
        date: z.string(), // YYYY-MM-DD
      })
    )
    .query(async ({ ctx, input }) => {
      const settings = await ctx.db.agentSettings.findUnique({
        where: { agentId: ctx.session.user.id },
      });

      const dayStart = new Date(`${input.date}T${settings?.workingHoursStart ?? "09:00"}:00`);
      const dayEnd = new Date(`${input.date}T${settings?.workingHoursEnd ?? "18:00"}:00`);
      const buffer = settings?.bufferMinutes ?? 30;

      // Get existing appointments for the day
      const existing = await ctx.db.appointment.findMany({
        where: {
          lead: { agentId: ctx.session.user.id },
          status: { in: ["PENDING", "CONFIRMED"] },
          startTime: { gte: dayStart, lte: dayEnd },
        },
        orderBy: { startTime: "asc" },
      });

      // Calculate available slots (1-hour slots with buffer)
      const slots: { start: Date; end: Date }[] = [];
      let current = dayStart;

      for (const appt of existing) {
        if (current.getTime() + 3600000 <= appt.startTime.getTime()) {
          slots.push({
            start: new Date(current),
            end: new Date(current.getTime() + 3600000),
          });
        }
        current = new Date(appt.endTime.getTime() + buffer * 60000);
      }

      // Fill remaining slots
      while (current.getTime() + 3600000 <= dayEnd.getTime()) {
        slots.push({
          start: new Date(current),
          end: new Date(current.getTime() + 3600000),
        });
        current = new Date(current.getTime() + 3600000 + buffer * 60000);
      }

      return slots;
    }),
});
