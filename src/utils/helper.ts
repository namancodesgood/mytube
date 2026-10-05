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

// videos.list takes up to 50 ids per call; keeps the given order and skips deleted/private videos
export const fetchVideosByIds = async (ids: string[]) => {
  const chunks = Array.from({ length: Math.ceil(ids.length / 50) }, (_, idx) =>
    ids.slice(idx * 50, idx * 50 + 50)
  );
  const pages = await Promise.all(
    chunks.map((chunk) =>
      ytFetch<VideoData>("videos", {
        part: "snippet,contentDetails,statistics,player",
        id: chunk.join(","),
      })
    )
  );
  const byId = new Map(
    pages.flatMap((page) => page.items ?? []).map((video) => [video.id, video])
  );
  return ids.flatMap((id) => byId.get(id) ?? []);
};

type PlaylistItems = {
  items?: { contentDetails: { videoId: string } }[];
};

const fetchPlaylistVideoIds = async (playlistId: string, maxResults: number) => {
  const playlist = await ytFetch<PlaylistItems>("playlistItems", {
    part: "contentDetails",
    playlistId,
    maxResults: String(maxResults),
  });
  return playlist.items?.map(({ contentDetails }) => contentDetails.videoId) ?? [];
};

// ponytail: first page only (max 50), page with nextPageToken when longer playlists matter
export const fetchPlaylistVideos = async (playlistId: string, maxResults = 24) =>
  fetchVideosByIds(await fetchPlaylistVideoIds(playlistId, maxResults));

// Newest uploads across channels, for the subscriptions feed and the bell
export const fetchLatestUploads = async (
  uploadPlaylists: string[],
  perChannel = 6
) => {
  const lists = await Promise.all(
    uploadPlaylists.map((playlistId) =>
      // one gone or empty channel shouldn't blank the whole feed
      fetchPlaylistVideoIds(playlistId, perChannel).catch(() => [])
    )
  );
  const videos = await fetchVideosByIds(lists.flat());
  return videos.sort(
    (a, b) => Date.parse(b.snippet.publishedAt) - Date.parse(a.snippet.publishedAt)
  );
};
