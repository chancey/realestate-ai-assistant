import type { ClassifiedReply, ReplyIntent } from "@realestate/shared";

const INTENT_KEYWORDS: Record<ReplyIntent, string[]> = {
  INQUIRY: ["interested", "more info", "tell me more", "details", "available", "still for sale", "is this", "how many"],
  SHOWING_REQUEST: ["see the house", "visit", "showing", "tour", "come by", "open house", "schedule", "walk through", "view the property"],
  PRICE_QUESTION: ["price", "cost", "how much", "asking", "offer", "afford", "mortgage", "payment", "negotiate", "reduced"],
  SPAM: ["click here", "check my", "follow me", "free money", "giveaway", "dm me for", "crypto", "nft"],
  NEGOTIATION: ["offer", "counter", "willing to", "accept", "lower", "negotiate", "terms", "contingency", "closing costs"],
  COMPLIMENT: ["beautiful", "gorgeous", "love it", "amazing", "stunning", "dream home", "wow", "nice", "great listing"],
  UNKNOWN: [],
};

export class IntentClassifier {
  async classify(text: string): Promise<ClassifiedReply> {
    // In production, use Anthropic API for more accurate classification
    const lowerText = text.toLowerCase();
    let bestIntent: ReplyIntent = "UNKNOWN";
    let bestScore = 0;

    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      const matches = keywords.filter((kw) => lowerText.includes(kw));
      const score = matches.length / Math.max(keywords.length, 1);
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent as ReplyIntent;
      }
    }

    return {
      intent: bestIntent,
      confidence: Math.max(bestScore, 0.3),
      suggestedResponse: undefined,
    };
  }
}
