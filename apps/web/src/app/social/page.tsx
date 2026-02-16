"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { platformDisplayName, formatDateTime } from "@/lib/utils";

const statusIcons: Record<string, React.ReactNode> = {
  PUBLISHED: <CheckCircle className="h-4 w-4 text-green-500" />,
  SCHEDULED: <Clock className="h-4 w-4 text-blue-500" />,
  FAILED: <XCircle className="h-4 w-4 text-red-500" />,
  PUBLISHING: <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />,
  DRAFT: <Clock className="h-4 w-4 text-gray-400" />,
};

const demoPosts = [
  {
    id: "1",
    platform: "INSTAGRAM",
    content: "Stunning 4BR estate in Beverly Hills! DM for a private showing...",
    status: "PUBLISHED",
    publishedAt: "2026-02-14T11:00:00Z",
    engagement: { likes: 142, comments: 12, shares: 5 },
    listing: "123 Oak Avenue",
  },
  {
    id: "2",
    platform: "FACEBOOK",
    content: "Just listed! Beautiful 3BR home in Santa Monica...",
    status: "SCHEDULED",
    scheduledAt: "2026-02-16T13:00:00Z",
    engagement: null,
    listing: "456 Maple Drive",
  },
  {
    id: "3",
    platform: "LINKEDIN",
    content: "Exciting investment opportunity in Pasadena...",
    status: "PUBLISHED",
    publishedAt: "2026-02-13T08:00:00Z",
    engagement: { likes: 56, comments: 8, shares: 3 },
    listing: "789 Pine Street",
  },
  {
    id: "4",
    platform: "X",
    content: "JUST LISTED in 90210! 4BR/3.5BA architectural masterpiece...",
    status: "PUBLISHED",
    publishedAt: "2026-02-14T17:00:00Z",
    engagement: { likes: 23, comments: 4, shares: 7 },
    listing: "123 Oak Avenue",
  },
  {
    id: "5",
    platform: "TIKTOK",
    content: "Tour this $2.4M Beverly Hills home with me...",
    status: "DRAFT",
    scheduledAt: null,
    engagement: null,
    listing: "123 Oak Avenue",
  },
];

const platformConnections = [
  { platform: "FACEBOOK", connected: true, account: "Jane's Real Estate Page" },
  { platform: "INSTAGRAM", connected: true, account: "@janerealestate" },
  { platform: "TIKTOK", connected: true, account: "@janehomes" },
  { platform: "LINKEDIN", connected: true, account: "Jane Smith, Realtor" },
  { platform: "X", connected: false, account: null },
  { platform: "YOUTUBE", connected: false, account: null },
];

export default function SocialPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Social Hub</h1>
            <p className="text-muted-foreground">
              Manage your social media posts and content calendar.
            </p>
          </div>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          {platformConnections.map((p) => (
            <Card
              key={p.platform}
              className={p.connected ? "" : "opacity-60"}
            >
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium">
                  {platformDisplayName(p.platform)}
                </p>
                {p.connected ? (
                  <p className="mt-1 text-xs text-green-600">Connected</p>
                ) : (
                  <Button size="sm" variant="outline" className="mt-1">
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Post Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 rounded-lg border p-4"
                >
                  <div className="mt-1">{statusIcons[post.status]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">
                        {platformDisplayName(post.platform)}
                      </Badge>
                      <Badge
                        variant={
                          post.status === "PUBLISHED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {post.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.listing}
                      </span>
                    </div>
                    <p className="text-sm truncate">{post.content}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      {post.publishedAt && (
                        <span>Published: {formatDateTime(post.publishedAt)}</span>
                      )}
                      {post.scheduledAt && post.status === "SCHEDULED" && (
                        <span>Scheduled: {formatDateTime(post.scheduledAt)}</span>
                      )}
                      {post.engagement && (
                        <span>
                          {post.engagement.likes} likes | {post.engagement.comments} comments | {post.engagement.shares} shares
                        </span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
