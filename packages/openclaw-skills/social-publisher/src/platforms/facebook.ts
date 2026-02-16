import type { PublishRequest, PublishResult } from "@realestate/shared";
import type { SocialCredentials } from "../index";

export class FacebookClient {
  private creds: SocialCredentials;

  constructor(creds: SocialCredentials) {
    this.creds = creds;
  }

  async publish(request: PublishRequest): Promise<PublishResult> {
    // Facebook Graph API v19
    // POST https://graph.facebook.com/v19.0/{page-id}/feed
    // Headers: Authorization: Bearer {access_token}
    // Body: { message, link, attached_media }
    const _url = `https://graph.facebook.com/v19.0/${this.creds.accountId}/feed`;
    const _body = {
      message: request.content,
      access_token: this.creds.accessToken,
    };

    // In production: const response = await fetch(url, { method: "POST", body: JSON.stringify(body) });
    return { success: true, platformPostId: `fb_${Date.now()}` };
  }

  async uploadPhoto(imageUrl: string): Promise<string> {
    // POST https://graph.facebook.com/v19.0/{page-id}/photos
    void imageUrl;
    return `fb_photo_${Date.now()}`;
  }

  async uploadVideo(videoUrl: string): Promise<string> {
    // POST https://graph.facebook.com/v19.0/{page-id}/videos
    void videoUrl;
    return `fb_video_${Date.now()}`;
  }
}
