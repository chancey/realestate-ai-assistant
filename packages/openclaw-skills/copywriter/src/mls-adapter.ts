import type { ListingData } from "@realestate/shared";
import { MLSClient, type MLSConfig } from "@realestate/mls-client";

export class MLSAdapter {
  private client: MLSClient;

  constructor(config: MLSConfig) {
    this.client = new MLSClient(config);
  }

  async fetchListing(mlsId: string): Promise<ListingData | null> {
    return this.client.getListingById(mlsId);
  }

  async searchListings(params: {
    city?: string;
    state?: string;
    zipCode?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ListingData[]> {
    return this.client.searchListings(params);
  }
}
