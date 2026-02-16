import type { CopywriterRequest, CopywriterResponse, Tone } from "@realestate/shared";
import { getSocialPostPrompt, getListingDescPrompt, getEmailPrompt, getVideoScriptPrompt, getOpenHousePrompt } from "./templates";

export interface CopywriterConfig {
  defaultTone: Tone;
  defaultLanguage: string;
  anthropicApiKey: string;
}

export class CopywriterSkill {
  private config: CopywriterConfig;

  constructor(config: CopywriterConfig) {
    this.config = config;
  }

  async generate(request: CopywriterRequest): Promise<CopywriterResponse> {
    const prompt = this.buildPrompt(request);
    const variants = [];

    for (let i = 1; i <= (request.variants ?? 3); i++) {
      const result = await this.callLLM(prompt, i);
      variants.push({
        body: result.body,
        hashtags: result.hashtags,
        variant: i,
      });
    }

    return { variants };
  }

  private buildPrompt(request: CopywriterRequest): string {
    const { listing, type, platform, tone, language } = request;

    switch (type) {
      case "SOCIAL_POST":
        return getSocialPostPrompt(listing, tone, platform, language);
      case "LISTING_DESC":
        return getListingDescPrompt(listing, tone, language);
      case "EMAIL":
        return getEmailPrompt(listing, tone, language);
      case "VIDEO_SCRIPT":
        return getVideoScriptPrompt(listing, tone, language);
      case "OPEN_HOUSE_FLYER":
        return getOpenHousePrompt(listing, tone, language);
      default:
        return getSocialPostPrompt(listing, tone, platform, language);
    }
  }

  private async callLLM(
    _prompt: string,
    variantNumber: number
  ): Promise<{ body: string; hashtags: string[] }> {
    // In production, call Anthropic Messages API:
    // POST https://api.anthropic.com/v1/messages
    // with model: "claude-sonnet-4-5-20250929"
    return {
      body: `[AI-generated content — variant ${variantNumber}]`,
      hashtags: ["#realestate", "#forsale", "#dreamhome"],
    };
  }
}

export default CopywriterSkill;
