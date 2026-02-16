"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Share2,
  MessageSquare,
  Calendar,
  TrendingUp,
  Users,
  PenSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { name: "Active Listings", value: "12", icon: Home, href: "/listings" },
  { name: "Posts Published", value: "48", icon: Share2, href: "/social" },
  { name: "Unread Replies", value: "7", icon: MessageSquare, href: "/inbox" },
  { name: "Upcoming Showings", value: "3", icon: Calendar, href: "/calendar" },
  { name: "Leads This Month", value: "24", icon: Users, href: "/analytics" },
  { name: "Engagement Rate", value: "4.2%", icon: TrendingUp, href: "/analytics" },
];

const recentActivity = [
  { text: "Published post for 123 Oak Ave to Instagram", time: "2 hours ago", type: "post" },
  { text: "New inquiry on 456 Maple Dr from John Smith", time: "3 hours ago", type: "reply" },
  { text: "Showing scheduled for 789 Pine St", time: "5 hours ago", type: "calendar" },
  { text: "Generated 3 copy variants for 321 Elm Rd", time: "1 day ago", type: "content" },
  { text: "Published listing to Facebook, LinkedIn, X", time: "1 day ago", type: "post" },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s your real estate marketing overview.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/content">
                <PenSquare className="mr-2 h-4 w-4" />
                Generate Copy
              </Link>
            </Button>
            <Button asChild>
              <Link href="/social">
                <Share2 className="mr-2 h-4 w-4" />
                Schedule Post
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.name}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/analytics">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <p className="text-sm">{activity.text}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
