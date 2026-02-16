import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc";

export const contentRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(
      z.object({
        listingId: z.string(),
        type: z.enum([
          "SOCIAL_POST",
          "LISTING_DESC",
          "EMAIL",
          "VIDEO_SCRIPT",
          "OPEN_HOUSE_FLYER",
        ]),
        platform: z
          .enum(["FACEBOOK", "INSTAGRAM", "TIKTOK", "LINKEDIN", "X", "YOUTUBE"])
          .optional(),
        tone: z.enum(["luxury", "family", "investment", "starter"]),
        language: z.string().default("en"),
        variants: z.number().int().min(1).max(5).default(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const listing = await ctx.db.listing.findFirstOrThrow({
        where: { id: input.listingId, agentId: ctx.session.user.id },
      });

      // In production, this calls the OpenClaw copywriter skill
      // For now, generate placeholder content
      const variants = [];
      for (let i = 1; i <= input.variants; i++) {
        const content = await ctx.db.generatedContent.create({
          data: {
            listingId: listing.id,
            type: input.type,
            platform: input.platform,
            tone: input.tone,
            language: input.language,
            body: generatePlaceholderCopy(listing, input.type, input.tone, i),
            hashtags: generateHashtags(listing),
            variant: i,
          },
        });
        variants.push(content);
      }

      return variants;
    }),

  listByListing: protectedProcedure
    .input(
      z.object({
        listingId: z.string(),
        type: z
          .enum([
            "SOCIAL_POST",
            "LISTING_DESC",
            "EMAIL",
            "VIDEO_SCRIPT",
            "OPEN_HOUSE_FLYER",
          ])
          .optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.generatedContent.findMany({
        where: {
          listingId: input.listingId,
          listing: { agentId: ctx.session.user.id },
          ...(input.type ? { type: input.type } : {}),
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  select: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const content = await ctx.db.generatedContent.findFirstOrThrow({
        where: { id: input.id },
        include: { listing: true },
      });

      // Deselect other variants of same type/platform
      await ctx.db.generatedContent.updateMany({
        where: {
          listingId: content.listingId,
          type: content.type,
          platform: content.platform,
          id: { not: input.id },
        },
        data: { selected: false },
      });

      return ctx.db.generatedContent.update({
        where: { id: input.id },
        data: { selected: true },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        body: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.generatedContent.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.generatedContent.delete({
        where: { id: input.id },
      });
    }),
});

function generatePlaceholderCopy(
  listing: { address: string; city: string; state: string; price: unknown; beds: number; baths: number; sqft: number; features: string[] },
  type: string,
  tone: string,
  variant: number
): string {
  const price = Number(listing.price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const toneAdjectives: Record<string, string> = {
    luxury: "Exquisite",
    family: "Beautiful",
    investment: "High-value",
    starter: "Charming",
  };

  const adj = toneAdjectives[tone] || "Beautiful";

  if (type === "SOCIAL_POST") {
    return `${adj} ${listing.beds}BR/${listing.baths}BA home in ${listing.city}, ${listing.state}! ${listing.sqft} sqft of living space at ${price}. ${listing.features.slice(0, 3).join(", ")}. DM for details! (Variant ${variant})`;
  }

  if (type === "LISTING_DESC") {
    return `Welcome to ${listing.address}, a ${adj.toLowerCase()} ${listing.beds}-bedroom, ${listing.baths}-bathroom home in the heart of ${listing.city}. This ${listing.sqft} square foot residence offers ${listing.features.join(", ")}. Listed at ${price}. Contact us today for a private showing. (Variant ${variant})`;
  }

  return `${adj} property at ${listing.address}, ${listing.city} ${listing.state} - ${price}. ${listing.beds} beds, ${listing.baths} baths, ${listing.sqft} sqft. (Variant ${variant})`;
}

function generateHashtags(listing: { city: string; state: string }): string[] {
  return [
    "#realestate",
    "#forsale",
    "#justlisted",
    `#${listing.city.replace(/\s/g, "")}realestate`,
    `#${listing.state}homes`,
    "#dreamhome",
    "#househunting",
    "#openhouse",
  ];
}
