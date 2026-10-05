import { FC } from "react";

import { useQuery } from "react-query";

import VideoCard from "@/components/video-card/VideoCard";
import BodyShimmer from "@/components/shimmer/BodyShimmer";

import { VideoData } from "@/interfaces/VideoData";
import { ytFetch } from "@/utils/helper";

type Props = {
  uploadsPlaylistId: string;
};

type PlaylistItems = {
  items?: { contentDetails: { videoId: string } }[];
};

// ponytail: latest 24 uploads only, page with nextPageToken when older ones are needed
const fetchUploads = async (playlistId: string) => {
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

const ChannelVideos: FC<Props> = ({ uploadsPlaylistId }) => {
  const { data: videos, status } = useQuery(
    ["channelUploads", uploadsPlaylistId],
    () => fetchUploads(uploadsPlaylistId)
  );

  if (status === "loading") return <BodyShimmer />;

  if (!videos?.length) {
    return (
      <p className="text-2xl">
        {status === "error" ? "Couldn't load videos." : "No videos yet."}
      </p>
    );
  }

  return (
    <div className="video-grid">
      {videos.map(({ id, snippet, statistics, contentDetails, player }) => (
        <VideoCard
          key={id}
          videoId={id}
          thumbnail={
            snippet.thumbnails?.medium?.url || snippet.thumbnails?.high?.url
          }
          channelTitle={snippet.channelTitle}
          videoTitle={snippet.title}
          viewCount={statistics?.viewCount}
          publishedAt={snippet.publishedAt}
          channelId={snippet.channelId}
          duration={contentDetails.duration}
          embed={player.embedHtml}
        />
      ))}
    </div>
  );
};

export default ChannelVideos;
