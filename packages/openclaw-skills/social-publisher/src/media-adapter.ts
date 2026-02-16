export interface MediaSpec {
  maxWidth: number;
  maxHeight: number;
  aspectRatio: string;
  maxFileSize: number;
  supportedFormats: string[];
}

const PLATFORM_SPECS: Record<string, MediaSpec> = {
  FACEBOOK_POST: { maxWidth: 2048, maxHeight: 2048, aspectRatio: "1:1", maxFileSize: 10_000_000, supportedFormats: ["jpg", "png", "gif"] },
  INSTAGRAM_FEED: { maxWidth: 1080, maxHeight: 1350, aspectRatio: "4:5", maxFileSize: 8_000_000, supportedFormats: ["jpg", "png"] },
  INSTAGRAM_STORY: { maxWidth: 1080, maxHeight: 1920, aspectRatio: "9:16", maxFileSize: 8_000_000, supportedFormats: ["jpg", "png"] },
  TIKTOK: { maxWidth: 1080, maxHeight: 1920, aspectRatio: "9:16", maxFileSize: 72_000_000, supportedFormats: ["mp4"] },
  LINKEDIN: { maxWidth: 1200, maxHeight: 627, aspectRatio: "1.91:1", maxFileSize: 5_000_000, supportedFormats: ["jpg", "png", "gif"] },
  X: { maxWidth: 1200, maxHeight: 675, aspectRatio: "16:9", maxFileSize: 5_000_000, supportedFormats: ["jpg", "png", "gif"] },
  YOUTUBE: { maxWidth: 1920, maxHeight: 1080, aspectRatio: "16:9", maxFileSize: 128_000_000_000, supportedFormats: ["mp4", "mov", "avi"] },
};

export function getMediaSpec(platform: string, contentType?: string): MediaSpec {
  const key = contentType ? `${platform}_${contentType}` : platform;
  return PLATFORM_SPECS[key] || PLATFORM_SPECS[platform] || PLATFORM_SPECS.FACEBOOK_POST;
}
