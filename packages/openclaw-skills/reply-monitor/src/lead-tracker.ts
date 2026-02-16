import type { ReplyIntent } from "@realestate/shared";

const INTENT_SCORES: Record<ReplyIntent, number> = {
  SHOWING_REQUEST: 40,
  NEGOTIATION: 35,
  PRICE_QUESTION: 25,
  INQUIRY: 20,
  COMPLIMENT: 10,
  SPAM: 0,
  UNKNOWN: 5,
};

export class LeadTracker {
  calculateScore(
    intent: ReplyIntent,
    reply: { body: string; platform: string }
  ): number {
    let score = INTENT_SCORES[intent] || 0;

    if (reply.body.length > 100) score += 10;
    if (reply.body.length > 200) score += 5;

    if (reply.platform === "LINKEDIN") score += 5;

    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(reply.body);
    const hasEmail = /\S+@\S+\.\S+/.test(reply.body);
    if (hasPhone) score += 15;
    if (hasEmail) score += 15;

    return Math.min(score, 100);
  }
}
