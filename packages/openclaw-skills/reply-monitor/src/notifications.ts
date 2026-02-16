export interface NotificationPayload {
  agentId: string;
  title: string;
  body: string;
  type: "escalation" | "new_lead" | "appointment" | "info";
  metadata?: Record<string, string>;
}

export class NotificationDispatcher {
  async send(payload: NotificationPayload): Promise<void> {
    // In production, send via:
    // 1. Web push notification
    // 2. Email notification
    // 3. SMS (for urgent escalations)
    console.log(`[Notification] ${payload.type}: ${payload.title} - ${payload.body}`);
  }

  async sendEscalation(
    agentId: string,
    replyAuthor: string,
    replyBody: string,
    platform: string
  ): Promise<void> {
    await this.send({
      agentId,
      title: `Action needed: ${replyAuthor} on ${platform}`,
      body: replyBody.substring(0, 200),
      type: "escalation",
      metadata: { platform, author: replyAuthor },
    });
  }
}
