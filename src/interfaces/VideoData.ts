import { Snippet } from "@/interfaces/Snippet";
import { Statistics } from "@/interfaces/Statistics";
import { ContentDetails } from "@/interfaces/ContentDetails";
import { Player } from "@/interfaces/Player";

export interface VideoData {
  items: {
    id: string;
    snippet: Snippet;
    statistics: Statistics;
    contentDetails: ContentDetails;
    player: Player;
  }[];
  nextPageToken: "string";
}
