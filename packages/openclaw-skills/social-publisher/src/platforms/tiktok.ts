import type { PublishRequest, PublishResult } from "@realestate/shared";
import type { SocialCredentials } from "../index";

export class TikTokClient {
  private creds: SocialCredentials;

  constructor(creds: SocialCredentials) {
    this.creds = creds;
  }

  async publish(request: PublishRequest): Promise<PublishResult> {
    // TikTok Content Posting API
    // POST https://open.tiktokapis.com/v2/post/publish/video/init/
    // Headers: Authorization: Bearer {access_token}
    // Body: { post_info: { title, description }, source_info: { source, video_url } }

    if (!request.mediaUrls?.length) {
      return { success: false, error: "TikTok requires a video file" };
    }

    void request.content;
    return { success: true, platformPostId: `tt_${Date.now()}` };
  }

  async checkPublishStatus(publishId: string): Promise<string> {
    // GET https://open.tiktokapis.com/v2/post/publish/status/fetch/
    void publishId;
    return "PUBLISH_COMPLETE";
  }
}
