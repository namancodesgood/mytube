import { FC } from "react";

import { useQuery } from "react-query";

import VideoCard from "@/components/video-card/VideoCard";
import BodyShimmer from "@/components/shimmer/BodyShimmer";

import { fetchUploads } from "@/utils/helper";

type Props = {
  uploadsPlaylistId: string;
};

const ChannelVideos: FC<Props> = ({ uploadsPlaylistId }) => {
  const { data: videos, status } = useQuery(
    ["channelUploads", uploadsPlaylistId],
    () => fetchUploads(uploadsPlaylistId)
  );

  if (status === "loading") return <BodyShimmer />;

  if (!videos?.length) {
    return (
      <p className="text-[1.4rem] text-yt-muted">
        {status === "error"
          ? "Couldn't load videos."
          : "This channel has no videos yet."}
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
