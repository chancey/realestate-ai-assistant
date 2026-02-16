import type { ListingData, Tone, Platform } from "@realestate/shared";

const FAIR_HOUSING_NOTICE = `
IMPORTANT: All generated content MUST comply with the Fair Housing Act.
- Do NOT use language that discriminates based on race, color, religion, sex, disability, familial status, or national origin.
- Do NOT describe neighborhoods using terms that could imply racial or ethnic composition.
- Focus on property features, not the types of people who live in the area.
`;

const PLATFORM_LIMITS: Record<string, { maxChars: number; maxHashtags: number }> = {
  FACEBOOK: { maxChars: 63206, maxHashtags: 10 },
  INSTAGRAM: { maxChars: 2200, maxHashtags: 30 },
  TIKTOK: { maxChars: 2200, maxHashtags: 10 },
  LINKEDIN: { maxChars: 3000, maxHashtags: 5 },
  X: { maxChars: 280, maxHashtags: 3 },
  YOUTUBE: { maxChars: 5000, maxHashtags: 15 },
};

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  luxury: "Use sophisticated, elegant language. Emphasize premium features, exclusivity, and lifestyle. Words like 'exquisite', 'bespoke', 'prestigious'.",
  family: "Use warm, welcoming language. Emphasize space, safety, schools, and community. Words like 'spacious', 'friendly', 'perfect for families'.",
  investment: "Use data-driven, ROI-focused language. Emphasize value, growth potential, rental income. Words like 'high-yield', 'appreciation', 'cash flow'.",
  starter: "Use encouraging, accessible language. Emphasize affordability, potential, and first-time buyer benefits. Words like 'charming', 'move-in ready', 'affordable'.",
};

function formatListingContext(listing: ListingData): string {
  return `
Property Details:
- Address: ${listing.address}
- City/State: ${listing.city}, ${listing.state} ${listing.zipCode}
- Price: $${listing.price.toLocaleString()}
- Bedrooms: ${listing.beds}
- Bathrooms: ${listing.baths}
- Square Feet: ${listing.sqft.toLocaleString()}
- Features: ${listing.features.join(", ") || "N/A"}
- Description: ${listing.description || "N/A"}
`;
}

export function getSocialPostPrompt(
  listing: ListingData,
  tone: Tone,
  platform?: Platform,
  language?: string
): string {
  const limits = platform ? PLATFORM_LIMITS[platform] : { maxChars: 2200, maxHashtags: 10 };

  return `You are an expert real estate marketing copywriter.

${FAIR_HOUSING_NOTICE}

Generate a social media post for the following property listing.

${formatListingContext(listing)}

Tone: ${TONE_INSTRUCTIONS[tone]}
Platform: ${platform || "General"}
Max characters: ${limits.maxChars}
Max hashtags: ${limits.maxHashtags}
Language: ${language || "English"}

Requirements:
- Write an engaging, scroll-stopping opening line
- Highlight the top 3 most compelling features
- Include a clear call-to-action (DM, link, call)
- Add relevant hashtags (mix of broad and local)
- Keep within character limits
- If language is not English, write the entire post in the specified language

Output format:
POST: [the post content]
HASHTAGS: [comma-separated hashtags]`;
}

export function getListingDescPrompt(
  listing: ListingData,
  tone: Tone,
  language?: string
): string {
  return `You are an expert real estate listing description writer.

${FAIR_HOUSING_NOTICE}

Generate a detailed, SEO-optimized listing description for the following property.

${formatListingContext(listing)}

Tone: ${TONE_INSTRUCTIONS[tone]}
Language: ${language || "English"}

Requirements:
- Write 200-400 words
- Start with a compelling opening that captures attention
- Describe the flow of the home room by room
- Highlight unique features and recent upgrades
- Mention the neighborhood amenities (without discriminatory language)
- End with a call to action for scheduling a showing
- Use SEO-friendly keywords naturally

Output the listing description only, no labels or metadata.`;
}

export function getEmailPrompt(
  listing: ListingData,
  tone: Tone,
  language?: string
): string {
  return `You are an expert real estate email marketing copywriter.

${FAIR_HOUSING_NOTICE}

Generate an email blast for the following property listing.

${formatListingContext(listing)}

Tone: ${TONE_INSTRUCTIONS[tone]}
Language: ${language || "English"}

Requirements:
- Subject line under 60 characters
- Preview text under 90 characters
- Email body with attention-grabbing headline, property highlights, 2-3 paragraphs, CTA button text
- Keep total body under 300 words

Output format:
SUBJECT: [subject line]
PREVIEW: [preview text]
BODY: [email body in HTML-ready format]
CTA: [call-to-action button text]`;
}

export function getVideoScriptPrompt(
  listing: ListingData,
  tone: Tone,
  language?: string
): string {
  return `You are an expert real estate video content creator.

${FAIR_HOUSING_NOTICE}

Generate a short-form video script (TikTok/Reels/YouTube Shorts) for the following property.

${formatListingContext(listing)}

Tone: ${TONE_INSTRUCTIONS[tone]}
Language: ${language || "English"}

Requirements:
- Script should be 30-60 seconds when spoken
- Start with a hook in the first 3 seconds
- Include shot/scene directions in [brackets]
- End with a strong CTA

Output format:
HOOK: [opening hook text]
SCRIPT:
[Scene 1]: [direction] / [voiceover or text]
CTA: [closing call-to-action]
MUSIC: [suggested audio/music style]`;
}

export function getOpenHousePrompt(
  listing: ListingData,
  tone: Tone,
  language?: string
): string {
  return `You are an expert real estate marketing copywriter.

${FAIR_HOUSING_NOTICE}

Generate open house flyer text content for the following property.

${formatListingContext(listing)}

Tone: ${TONE_INSTRUCTIONS[tone]}
Language: ${language || "English"}

Requirements:
- Bold headline
- Include all key property details (beds, baths, sqft, price)
- 2-3 sentences of compelling description
- Include placeholder for: date, time, agent name, agent phone

Output format:
HEADLINE: [headline]
TAGLINE: [short tagline]
DESCRIPTION: [2-3 sentences]
DETAILS: [formatted property details]`;
}
