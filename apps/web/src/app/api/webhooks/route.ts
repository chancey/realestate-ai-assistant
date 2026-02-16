import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

// Webhook receiver for all social media platform callbacks
export async function POST(request: NextRequest) {
  const platform = request.nextUrl.searchParams.get("platform");
  const body = await request.json();

  try {
    switch (platform) {
      case "facebook":
      case "instagram":
        return handleFacebookWebhook(body);
      case "tiktok":
        return handleTikTokWebhook(body);
      case "linkedin":
        return handleLinkedInWebhook(body);
      case "twitter":
        return handleTwitterWebhook(body);
      default:
        return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Facebook/Instagram webhook verification
export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("hub.mode");
  const token = request.nextUrl.searchParams.get("hub.verify_token");
  const challenge = request.nextUrl.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

async function handleFacebookWebhook(body: Record<string, unknown>) {
  // Process Facebook/Instagram comment and message webhooks
  const entries = body.entry as Array<{
    changes?: Array<{ field: string; value: Record<string, unknown> }>;
  }>;

  if (!entries) return NextResponse.json({ status: "ok" });

  for (const entry of entries) {
    if (!entry.changes) continue;
    for (const change of entry.changes) {
      if (change.field === "feed") {
        // New comment on a post
        await processIncomingReply({
          platform: "FACEBOOK",
          data: change.value,
        });
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}

async function handleTikTokWebhook(body: Record<string, unknown>) {
  // Process TikTok comment webhooks
  void body;
  return NextResponse.json({ status: "ok" });
}

async function handleLinkedInWebhook(body: Record<string, unknown>) {
  // Process LinkedIn comment webhooks
  void body;
  return NextResponse.json({ status: "ok" });
}

async function handleTwitterWebhook(body: Record<string, unknown>) {
  // Process Twitter/X mention and reply webhooks
  void body;
  return NextResponse.json({ status: "ok" });
}

async function processIncomingReply(params: {
  platform: string;
  data: Record<string, unknown>;
}) {
  // In production:
  // 1. Find the matching Post in our DB
  // 2. Create a Reply record
  // 3. Classify the intent using the ReplyMonitor skill
  // 4. Auto-respond if appropriate
  // 5. Create/update Lead record
  // 6. Notify agent if escalation needed
  console.log(`Processing incoming ${params.platform} reply`);
  void db;
}
