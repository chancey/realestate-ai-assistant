"use client";

import { Sidebar } from "./sidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen">
        <Sidebar />
        <main className="pl-64">
          <div className="p-8">
            <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              You are not signed in.{" "}
              <Link href="/auth/signin" className="font-medium underline">
                Sign in
              </Link>{" "}
              to access all features. Browsing in demo mode.
            </div>
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
