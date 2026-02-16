"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, Link2, Calendar, Bot } from "lucide-react";
import { platformDisplayName } from "@/lib/utils";

const socialPlatforms = ["FACEBOOK", "INSTAGRAM", "TIKTOK", "LINKEDIN", "X", "YOUTUBE"];

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, integrations, and preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent Profile</CardTitle>
            <CardDescription>Your professional information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue="Jane Smith" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue="jane@realestate.com" className="mt-1" readOnly />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input defaultValue="(310) 555-0123" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">License Number</label>
                <Input defaultValue="DRE# 01234567" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Brokerage</label>
                <Input defaultValue="Premium Realty Group" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Timezone</label>
                <Select defaultValue="America/Los_Angeles" className="mt-1">
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/New_York">Eastern Time</option>
                </Select>
              </div>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Social Media Connections
            </CardTitle>
            <CardDescription>
              Connect your social media accounts to publish content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {socialPlatforms.map((platform) => (
                <div
                  key={platform}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {platformDisplayName(platform)}
                    </span>
                    {["FACEBOOK", "INSTAGRAM", "LINKEDIN", "TIKTOK"].includes(platform) ? (
                      <Badge className="bg-green-100 text-green-800">
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not Connected</Badge>
                    )}
                  </div>
                  <Button
                    variant={
                      ["FACEBOOK", "INSTAGRAM", "LINKEDIN", "TIKTOK"].includes(platform)
                        ? "outline"
                        : "default"
                    }
                    size="sm"
                  >
                    {["FACEBOOK", "INSTAGRAM", "LINKEDIN", "TIKTOK"].includes(platform)
                      ? "Reconnect"
                      : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar Integration
            </CardTitle>
            <CardDescription>
              Connect your calendar for automated scheduling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Google Calendar</p>
                <p className="text-sm text-muted-foreground">
                  Sync showings and appointments
                </p>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Calendly</p>
                <p className="text-sm text-muted-foreground">
                  Auto-generate booking links
                </p>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Preferences
            </CardTitle>
            <CardDescription>
              Configure content generation and auto-reply behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Default Tone</label>
                <Select defaultValue="family" className="mt-1">
                  <option value="luxury">Luxury</option>
                  <option value="family">Family-friendly</option>
                  <option value="investment">Investment</option>
                  <option value="starter">First-time Buyer</option>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Default Language</label>
                <Select defaultValue="en" className="mt-1">
                  <option value="en">English</option>
                  <option value="zh">Chinese</option>
                  <option value="es">Spanish</option>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Working Hours Start</label>
                <Input type="time" defaultValue="09:00" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Working Hours End</label>
                <Input type="time" defaultValue="18:00" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Buffer Between Showings</label>
                <Select defaultValue="30" className="mt-1">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Auto-Reply</label>
                <Select defaultValue="enabled" className="mt-1">
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">MLS Provider</label>
              <div className="grid gap-4 md:grid-cols-2 mt-1">
                <Select defaultValue="">
                  <option value="">Select provider...</option>
                  <option value="rets">RETS</option>
                  <option value="spark">Spark</option>
                  <option value="bridge">Bridge Interactive</option>
                </Select>
                <Input placeholder="MLS API Key" type="password" />
              </div>
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
