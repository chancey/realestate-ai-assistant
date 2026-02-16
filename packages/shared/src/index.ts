export type Platform = "FACEBOOK" | "INSTAGRAM" | "TIKTOK" | "LINKEDIN" | "X" | "YOUTUBE";
export type ContentType = "SOCIAL_POST" | "LISTING_DESC" | "EMAIL" | "VIDEO_SCRIPT" | "OPEN_HOUSE_FLYER";
export type Tone = "luxury" | "family" | "investment" | "starter";
export type ReplyIntent = "INQUIRY" | "SHOWING_REQUEST" | "PRICE_QUESTION" | "SPAM" | "NEGOTIATION" | "COMPLIMENT" | "UNKNOWN";
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "SHOWING_SCHEDULED" | "CLOSED";
export type ListingStatus = "ACTIVE" | "PENDING" | "SOLD" | "WITHDRAWN" | "EXPIRED";

export interface ListingData {
  mlsId?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  description?: string;
  features: string[];
  photos: string[];
}

export interface CopywriterRequest {
  listing: ListingData;
  type: ContentType;
  platform?: Platform;
  tone: Tone;
  language?: string;
  variants?: number;
}

export interface CopywriterResponse {
  variants: {
    body: string;
    hashtags: string[];
    variant: number;
  }[];
}

export interface PublishRequest {
  platform: Platform;
  content: string;
  mediaUrls?: string[];
  scheduledAt?: string;
}

export interface PublishResult {
  success: boolean;
  platformPostId?: string;
  error?: string;
}

export interface ClassifiedReply {
  intent: ReplyIntent;
  confidence: number;
  suggestedResponse?: string;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  location?: string;
}

export interface BookingRequest {
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  listingId?: string;
  preferredTimes?: string[];
  type: string;
}
