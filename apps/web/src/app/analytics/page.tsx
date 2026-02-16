"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Share2, MessageSquare, Eye } from "lucide-react";

const overviewStats = [
  { name: "Total Impressions", value: "12,450", change: "+18%", up: true, icon: Eye },
  { name: "Engagement Rate", value: "4.2%", change: "+0.8%", up: true, icon: TrendingUp },
  { name: "Total Leads", value: "24", change: "+6", up: true, icon: Users },
  { name: "Posts Published", value: "48", change: "+12", up: true, icon: Share2 },
];

const platformMetrics = [
  { platform: "Instagram", posts: 18, impressions: 5200, engagement: "5.1%", leads: 8 },
  { platform: "Facebook", posts: 15, impressions: 3800, engagement: "3.8%", leads: 7 },
  { platform: "LinkedIn", posts: 8, impressions: 2100, engagement: "4.5%", leads: 5 },
  { platform: "X", posts: 5, impressions: 980, engagement: "2.9%", leads: 3 },
  { platform: "TikTok", posts: 2, impressions: 370, engagement: "6.2%", leads: 1 },
];

const topPosts = [
  { content: "Stunning Beverly Hills estate...", platform: "Instagram", likes: 142, comments: 12 },
  { content: "Investment opportunity in Pasadena...", platform: "LinkedIn", likes: 56, comments: 8 },
  { content: "Just listed in Santa Monica...", platform: "Facebook", likes: 89, comments: 15 },
];

export default function AnalyticsPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your marketing performance across all platforms.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {overviewStats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.up ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${stat.up ? "text-green-500" : "text-red-500"}`}>
                    {stat.change} vs last month
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Platform</th>
                    <th className="pb-3 font-medium">Posts</th>
                    <th className="pb-3 font-medium">Impressions</th>
                    <th className="pb-3 font-medium">Engagement</th>
                    <th className="pb-3 font-medium">Leads</th>
                  </tr>
                </thead>
                <tbody>
                  {platformMetrics.map((m) => (
                    <tr key={m.platform} className="border-b last:border-0">
                      <td className="py-3 font-medium">{m.platform}</td>
                      <td className="py-3">{m.posts}</td>
                      <td className="py-3">{m.impressions.toLocaleString()}</td>
                      <td className="py-3">{m.engagement}</td>
                      <td className="py-3">{m.leads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-3 last:border-0">
                  <span className="text-2xl font-bold text-muted-foreground">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm">{post.content}</p>
                    <Badge variant="outline" className="mt-1">
                      {post.platform}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{post.likes} likes</span>
                    <span>
                      <MessageSquare className="inline h-3 w-3 mr-1" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
