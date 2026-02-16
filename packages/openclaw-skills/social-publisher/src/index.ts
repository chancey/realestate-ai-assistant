import type { Platform, PublishRequest, PublishResult } from "@realestate/shared";
import { FacebookClient } from "./platforms/facebook";
import { InstagramClient } from "./platforms/instagram";
import { TikTokClient } from "./platforms/tiktok";
import { LinkedInClient } from "./platforms/linkedin";
import { TwitterClient } from "./platforms/twitter";
import { YouTubeClient } from "./platforms/youtube";

export interface SocialCredentials {
  platform: Platform;
  accessToken: string;
  refreshToken?: string;
  accountId: string;
}

export class SocialPublisher {
  private credentials: Map<Platform, SocialCredentials> = new Map();

  addCredentials(creds: SocialCredentials) {
    this.credentials.set(creds.platform, creds);
  }

  async publish(request: PublishRequest): Promise<PublishResult> {
    const creds = this.credentials.get(request.platform);
    if (!creds) {
      return { success: false, error: `No credentials for ${request.platform}` };
    }

    try {
      switch (request.platform) {
        case "FACEBOOK":
          return new FacebookClient(creds).publish(request);
        case "INSTAGRAM":
          return new InstagramClient(creds).publish(request);
        case "TIKTOK":
          return new TikTokClient(creds).publish(request);
        case "LINKEDIN":
          return new LinkedInClient(creds).publish(request);
        case "X":
          return new TwitterClient(creds).publish(request);
        case "YOUTUBE":
          return new YouTubeClient(creds).publish(request);
        default:
          return { success: false, error: `Unsupported platform: ${request.platform}` };
      }
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async publishToMultiple(
    request: Omit<PublishRequest, "platform">,
    platforms: Platform[]
  ): Promise<Map<Platform, PublishResult>> {
    const results = new Map<Platform, PublishResult>();
    await Promise.allSettled(
      platforms.map(async (platform) => {
        const result = await this.publish({ ...request, platform });
        results.set(platform, result);
      })
    );
    return results;
  }
}

export default SocialPublisher;
