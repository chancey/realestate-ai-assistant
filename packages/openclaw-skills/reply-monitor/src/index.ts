import type { ClassifiedReply } from "@realestate/shared";
import { IntentClassifier } from "./classifier";
import { AutoResponder } from "./auto-responder";
import { LeadTracker } from "./lead-tracker";

export interface ReplyData {
  platform: string;
  authorName: string;
  authorId: string;
  body: string;
  postId: string;
  listingAddress?: string;
}

export class ReplyMonitor {
  private classifier: IntentClassifier;
  private responder: AutoResponder;
  private leadTracker: LeadTracker;

  constructor() {
    this.classifier = new IntentClassifier();
    this.responder = new AutoResponder();
    this.leadTracker = new LeadTracker();
  }

  async processReply(reply: ReplyData): Promise<{
    classification: ClassifiedReply;
    autoResponse?: string;
    leadScore?: number;
    shouldEscalate: boolean;
  }> {
    const classification = await this.classifier.classify(reply.body);

    let autoResponse: string | undefined;
    if (["INQUIRY", "PRICE_QUESTION", "COMPLIMENT"].includes(classification.intent)) {
      autoResponse = this.responder.generateResponse(classification.intent, {
        authorName: reply.authorName,
        listingAddress: reply.listingAddress,
      });
    }

    const leadScore = this.leadTracker.calculateScore(classification.intent, reply);

    const shouldEscalate =
      ["NEGOTIATION", "SHOWING_REQUEST"].includes(classification.intent) ||
      classification.confidence < 0.5;

    return { classification, autoResponse, leadScore, shouldEscalate };
  }
}

export default ReplyMonitor;
