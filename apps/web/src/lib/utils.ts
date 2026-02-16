import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  return Number(price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function platformDisplayName(platform: string): string {
  const names: Record<string, string> = {
    FACEBOOK: "Facebook",
    INSTAGRAM: "Instagram",
    TIKTOK: "TikTok",
    LINKEDIN: "LinkedIn",
    X: "X (Twitter)",
    YOUTUBE: "YouTube",
  };
  return names[platform] ?? platform;
}

export function intentColor(intent: string): string {
  const colors: Record<string, string> = {
    INQUIRY: "bg-blue-100 text-blue-800",
    SHOWING_REQUEST: "bg-green-100 text-green-800",
    PRICE_QUESTION: "bg-yellow-100 text-yellow-800",
    SPAM: "bg-gray-100 text-gray-800",
    NEGOTIATION: "bg-purple-100 text-purple-800",
    COMPLIMENT: "bg-pink-100 text-pink-800",
    UNKNOWN: "bg-gray-100 text-gray-600",
  };
  return colors[intent] ?? "bg-gray-100 text-gray-600";
}
