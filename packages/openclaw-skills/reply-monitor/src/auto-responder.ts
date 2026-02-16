import type { ReplyIntent } from "@realestate/shared";

interface ResponseContext {
  authorName: string;
  listingAddress?: string;
  agentName?: string;
  agentPhone?: string;
}

const RESPONSE_TEMPLATES: Record<string, string[]> = {
  INQUIRY: [
    "Hi {authorName}! Thanks for your interest in {listingAddress}. I'd love to share more details with you. Feel free to DM me or call me to discuss!",
    "Hey {authorName}! Great question about {listingAddress}. I'll send you all the details via DM. What's the best way to reach you?",
  ],
  PRICE_QUESTION: [
    "Hi {authorName}! Great question. I'd be happy to discuss pricing and any available incentives for {listingAddress}. Let's connect - DM me or give me a call!",
  ],
  COMPLIMENT: [
    "Thank you so much, {authorName}! It truly is a special property. Would you like to schedule a private showing?",
    "Thanks {authorName}! Wait until you see it in person - it's even better! Let me know if you'd like to visit.",
  ],
  SHOWING_REQUEST: [
    "Hi {authorName}! I'd love to show you {listingAddress}. Let me check my availability and I'll DM you some time slots!",
  ],
};

export class AutoResponder {
  generateResponse(intent: ReplyIntent, context: ResponseContext): string {
    const templates = RESPONSE_TEMPLATES[intent];
    if (!templates || templates.length === 0) {
      return `Hi ${context.authorName}! Thanks for reaching out. I'll get back to you shortly.`;
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    return template
      .replace(/{authorName}/g, context.authorName)
      .replace(/{listingAddress}/g, context.listingAddress || "this property")
      .replace(/{agentName}/g, context.agentName || "your agent")
      .replace(/{agentPhone}/g, context.agentPhone || "");
  }
}
