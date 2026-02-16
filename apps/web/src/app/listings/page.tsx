"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, PenSquare, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

// Demo data - in production, fetched via tRPC
const demoListings = [
  {
    id: "1",
    address: "123 Oak Avenue",
    city: "Beverly Hills",
    state: "CA",
    zipCode: "90210",
    price: 2450000,
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    status: "ACTIVE" as const,
    contentCount: 5,
    postCount: 8,
  },
  {
    id: "2",
    address: "456 Maple Drive",
    city: "Santa Monica",
    state: "CA",
    zipCode: "90401",
    price: 1850000,
    beds: 3,
    baths: 2,
    sqft: 2100,
    status: "ACTIVE" as const,
    contentCount: 3,
    postCount: 4,
  },
  {
    id: "3",
    address: "789 Pine Street",
    city: "Pasadena",
    state: "CA",
    zipCode: "91101",
    price: 975000,
    beds: 3,
    baths: 2,
    sqft: 1650,
    status: "PENDING" as const,
    contentCount: 2,
    postCount: 6,
  },
];

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  SOLD: "bg-blue-100 text-blue-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
  EXPIRED: "bg-red-100 text-red-800",
};

export default function ListingsPage() {
  const [search, setSearch] = useState("");

  const filtered = demoListings.filter(
    (l) =>
      l.address.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Listings</h1>
            <p className="text-muted-foreground">
              Manage your property listings and generate marketing content.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Import from MLS</Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Listing
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                <span className="text-4xl text-blue-200">
                  {listing.beds}BR
                </span>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">
                    {listing.address}
                  </CardTitle>
                  <Badge className={statusColors[listing.status]}>
                    {listing.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {listing.city}, {listing.state} {listing.zipCode}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-xl font-bold">
                    {formatPrice(listing.price)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {listing.beds} beds | {listing.baths} baths |{" "}
                    {listing.sqft.toLocaleString()} sqft
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{listing.contentCount} content variants</span>
                    <span>{listing.postCount} posts</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href={`/content?listing=${listing.id}`}>
                        <PenSquare className="mr-1 h-3 w-3" />
                        Generate Copy
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/listings/${listing.id}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
