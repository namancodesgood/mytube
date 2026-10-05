import { Thumbnail } from "@/interfaces/Thumbnail";

export interface ChannelData {
  items?: {
    id: string;
    snippet: {
      title: string;
      description: string;
      customUrl: string;
      publishedAt: string;
      country?: string;
      thumbnails: {
        default: Thumbnail;
        medium: Thumbnail;
        high: Thumbnail;
      };
    };
    contentDetails: {
      relatedPlaylists: { uploads: string };
    };
    statistics: {
      viewCount: string;
      subscriberCount: string;
      hiddenSubscriberCount: boolean;
      videoCount: string;
    };
    brandingSettings?: {
      image?: { bannerExternalUrl?: string };
    };
  }[];
}

export type ChannelItem = NonNullable<ChannelData["items"]>[number];
