import { YT_API_URI } from "@/utils/constants";
import { ChannelData } from "@/interfaces/ChannelData";
import { VideoData } from "@/interfaces/VideoData";

export const ytFetch = async <T>(
  resource: string,
  params: Record<string, string>
): Promise<T> => {
  const query = new URLSearchParams({
    ...params,
    key: import.meta.env.VITE_YT_API_KEY,
  });
  const response = await fetch(`${YT_API_URI}/${resource}?${query}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `${response.status}: ${data.error?.message ?? response.statusText}`
    );
  }

  return data;
};

// Every ["channelDetails", id] query uses this, so the cached shape is always the same.
export const fetchChannelDetails = (channelId: string) =>
  ytFetch<ChannelData>("channels", {
    part: "snippet,contentDetails,statistics,brandingSettings",
    id: channelId,
  });

type PlaylistItems = {
  items?: { contentDetails: { videoId: string } }[];
};

// ponytail: latest 24 uploads only, page with nextPageToken when older ones are needed
export const fetchUploads = async (playlistId: string) => {
  const uploads = await ytFetch<PlaylistItems>("playlistItems", {
    part: "contentDetails",
    playlistId,
    maxResults: "24",
  });
  const ids = uploads.items?.map(({ contentDetails }) => contentDetails.videoId);

  if (!ids?.length) return [];

  // playlistItems has no stats or duration, so fetch the videos themselves (1 call for all)
  const videos = await ytFetch<VideoData>("videos", {
    part: "snippet,contentDetails,statistics,player",
    id: ids.join(","),
  });
  return videos.items;
};
