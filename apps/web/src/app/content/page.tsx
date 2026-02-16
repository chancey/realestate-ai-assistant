"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Copy, Check, Share2 } from "lucide-react";
import { useState } from "react";

const contentTypes = [
  { value: "SOCIAL_POST", label: "Social Media Post" },
  { value: "LISTING_DESC", label: "Listing Description" },
  { value: "EMAIL", label: "Email Blast" },
  { value: "VIDEO_SCRIPT", label: "Video Script" },
  { value: "OPEN_HOUSE_FLYER", label: "Open House Flyer" },
];

const platforms = [
  { value: "", label: "All Platforms" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "X", label: "X (Twitter)" },
  { value: "YOUTUBE", label: "YouTube" },
];

const tones = [
  { value: "luxury", label: "Luxury" },
  { value: "family", label: "Family-friendly" },
  { value: "investment", label: "Investment" },
  { value: "starter", label: "First-time Buyer" },
];

const demoVariants = [
  {
    variant: 1,
    body: "Stunning 4BR/3.5BA estate in Beverly Hills! 3,200 sqft of pure luxury with panoramic views, chef's kitchen, and resort-style pool. Your dream home awaits at $2,450,000. DM for a private showing!",
    hashtags: ["#BeverlyHills", "#LuxuryLiving", "#DreamHome", "#JustListed", "#RealEstate"],
    selected: true,
  },
  {
    variant: 2,
    body: "Welcome to 123 Oak Avenue - where elegance meets comfort in the heart of Beverly Hills. This exquisite 4-bedroom residence features soaring ceilings, designer finishes, and an entertainer's backyard. Listed at $2.45M.",
    hashtags: ["#BeverlyHillsRealEstate", "#LuxuryHome", "#CaliforniaLiving", "#OpenHouse"],
    selected: false,
  },
  {
    variant: 3,
    body: "JUST LISTED in 90210! This architectural masterpiece at 123 Oak Ave offers 3,200 sqft of refined living. 4 beds, 3.5 baths, infinity pool, and views that will take your breath away. Asking $2,450,000.",
    hashtags: ["#90210", "#JustListed", "#LuxuryRealEstate", "#BeverlyHills", "#MillionDollarListing"],
    selected: false,
  },
];

export default function ContentPage() {
  const [selectedType, setSelectedType] = useState("SOCIAL_POST");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedTone, setSelectedTone] = useState("luxury");
  const [variants, setVariants] = useState(demoVariants);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSelect = (idx: number) => {
    setVariants(variants.map((v, i) => ({ ...v, selected: i === idx })));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Content Studio</h1>
          <p className="text-muted-foreground">
            Generate AI-powered marketing content for your listings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium">Content Type</label>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="mt-1"
                >
                  {contentTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Platform</label>
                <Select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="mt-1"
                >
                  {platforms.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Tone</label>
                <Select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="mt-1"
                >
                  {tones.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generated Variants</h2>
          {variants.map((variant, idx) => (
            <Card
              key={variant.variant}
              className={variant.selected ? "ring-2 ring-primary" : ""}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">
                      Variant {variant.variant}
                    </CardTitle>
                    {variant.selected && <Badge>Selected</Badge>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(variant.body, idx)}
                    >
                      {copiedIdx === idx ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSelect(idx)}
                    >
                      Select
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="mr-1 h-3 w-3" />
                      Post
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={variant.body}
                  className="mb-3 min-h-[100px]"
                  readOnly
                />
                <div className="flex flex-wrap gap-1">
                  {variant.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
