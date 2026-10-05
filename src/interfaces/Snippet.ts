import { Thumbnail } from "@/interfaces/Thumbnail";
import { LiveBroadcastContent } from "@/interfaces/LiveBroadcastContent";

export interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    maxres: Thumbnail
  };
  channelTitle: string;
  tags?: string[];
  liveBroadcastContent: LiveBroadcastContent;
  publishTime: string;
}
