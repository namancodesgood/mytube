import { FC, Ref } from "react";

import VideoCard from "@/components/video-card/VideoCard";

import { VideoItem } from "@/interfaces/VideoData";

type Props = {
  videos: VideoItem[];
  sentinelRef?: Ref<HTMLDivElement>; // attached near the end to load the next page
};

const VideoGrid: FC<Props> = ({ videos, sentinelRef }) => {
  const sentinelIndex = Math.max(0, videos.length - 10);

  return (
    <div className="video-grid">
      {videos.map(({ id, snippet, statistics, contentDetails, player }, idx) => (
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
          innerRef={idx === sentinelIndex ? sentinelRef : undefined}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
