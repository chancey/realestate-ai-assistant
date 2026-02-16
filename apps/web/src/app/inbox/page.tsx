"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Filter } from "lucide-react";
import { platformDisplayName, intentColor, formatDateTime } from "@/lib/utils";
import { useState } from "react";

const demoReplies = [
  {
    id: "1",
    platform: "INSTAGRAM",
    authorName: "John Smith",
    body: "This house is gorgeous! Can I schedule a showing this weekend?",
    intent: "SHOWING_REQUEST",
    responded: false,
    suggestedResponse: "Hi John! I'd love to show you this property. Let me check my availability for this weekend and I'll DM you some time slots!",
    createdAt: "2026-02-15T10:30:00Z",
    listing: "123 Oak Avenue",
  },
  {
    id: "2",
    platform: "FACEBOOK",
    authorName: "Sarah Johnson",
    body: "What's the asking price? Is there any room for negotiation?",
    intent: "PRICE_QUESTION",
    responded: false,
    suggestedResponse: "Hi Sarah! Great question. The listing price is $2,450,000. I'd be happy to discuss pricing details. Let's connect - feel free to DM me!",
    createdAt: "2026-02-15T09:15:00Z",
    listing: "123 Oak Avenue",
  },
  {
    id: "3",
    platform: "LINKEDIN",
    authorName: "Mike Chen",
    body: "Interested in learning more about the investment potential. What's the rental yield in the area?",
    intent: "INQUIRY",
    responded: true,
    suggestedResponse: null,
    createdAt: "2026-02-14T16:00:00Z",
    listing: "789 Pine Street",
  },
  {
    id: "4",
    platform: "INSTAGRAM",
    authorName: "Emily Davis",
    body: "Wow, absolutely stunning home! Love the kitchen!",
    intent: "COMPLIMENT",
    responded: true,
    suggestedResponse: null,
    createdAt: "2026-02-14T14:20:00Z",
    listing: "123 Oak Avenue",
  },
  {
    id: "5",
    platform: "FACEBOOK",
    authorName: "SpamBot2000",
    body: "Check out my page for free crypto tips! Click here now!",
    intent: "SPAM",
    responded: false,
    suggestedResponse: null,
    createdAt: "2026-02-14T12:00:00Z",
    listing: "456 Maple Drive",
  },
];

export default function InboxPage() {
  const [selectedReply, setSelectedReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = demoReplies.filter((r) => {
    if (filter === "unresponded") return !r.responded && r.intent !== "SPAM";
    if (filter === "all") return true;
    return r.intent === filter;
  });

  const handleSelectReply = (reply: typeof demoReplies[0]) => {
    setSelectedReply(reply.id);
    setReplyText(reply.suggestedResponse || "");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inbox</h1>
            <p className="text-muted-foreground">
              Unified inbox for all social media replies and messages.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="rounded border bg-background px-2 py-1 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="unresponded">Unresponded</option>
              <option value="SHOWING_REQUEST">Showing Requests</option>
              <option value="INQUIRY">Inquiries</option>
              <option value="PRICE_QUESTION">Price Questions</option>
              <option value="NEGOTIATION">Negotiations</option>
              <option value="COMPLIMENT">Compliments</option>
              <option value="SPAM">Spam</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {demoReplies.filter((r) => !r.responded && r.intent !== "SPAM").length}
              </p>
              <p className="text-xs text-muted-foreground">Needs Response</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {demoReplies.filter((r) => r.intent === "SHOWING_REQUEST").length}
              </p>
              <p className="text-xs text-muted-foreground">Showing Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {demoReplies.filter((r) => r.intent === "INQUIRY").length}
              </p>
              <p className="text-xs text-muted-foreground">Inquiries</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{demoReplies.length}</p>
              <p className="text-xs text-muted-foreground">Total Replies</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {filtered.map((reply) => (
            <Card
              key={reply.id}
              className={`cursor-pointer transition-shadow hover:shadow-md ${selectedReply === reply.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleSelectReply(reply)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-muted p-2">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {reply.authorName}
                      </span>
                      <Badge variant="outline">
                        {platformDisplayName(reply.platform)}
                      </Badge>
                      <Badge className={intentColor(reply.intent)}>
                        {reply.intent.replace("_", " ")}
                      </Badge>
                      {reply.responded && (
                        <Badge variant="secondary">Replied</Badge>
                      )}
                    </div>
                    <p className="text-sm">{reply.body}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{reply.listing}</span>
                      <span>{formatDateTime(reply.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedReply === reply.id && !reply.responded && reply.intent !== "SPAM" && (
                  <div className="mt-4 border-t pt-4">
                    <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
                      <Bot className="h-3 w-3" />
                      AI-suggested response
                    </div>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="mb-2"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Send className="mr-1 h-3 w-3" />
                        Send Reply
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
