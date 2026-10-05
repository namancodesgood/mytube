import { useState } from "react";

import { useQuery } from "react-query";

import { fetchChannelDetails } from "@/utils/helper";

import { Link } from "react-router-dom";

import VideoCardPreview from "@/components/video-card/VideoCardPreview";
import VideoCardThumbnail from "@/components/video-card/VideoCardThumbnail";
import VideoCardDuration from "@/components/video-card/VideoCardDuration";
import VideoCardTitle from "@/components/video-card/VideoCardTitle";
import VideoCardChannelImage from "@/components/video-card/VideoCardChannelImage";
import VideoCardMetdataBar from "@/components/video-card/VideoCardMetdataBar";

import VideoCardShimmer from "@/components/shimmer/VideoCardShimmer";

type Props = {
  videoId: string;
  thumbnail: string;
  channelTitle: string;
  videoTitle: string;
  viewCount: string;
  publishedAt: string;
  channelId: string;
  duration: string;
  embed: string;
  innerRef?: React.Ref<HTMLDivElement>;
};

const VideoCard = ({
  videoId,
  thumbnail,
  channelTitle,
  videoTitle,
  viewCount,
  publishedAt,
  channelId,
  duration,
  embed,
  innerRef,
}: Props) => {
  const [isHover, setIsHover] = useState(false);

  const { data, status } = useQuery(
    ["channelDetails", channelId],
    () => fetchChannelDetails(channelId),
    {
      onError: (err) => {
        console.error("Error fetching channel details:", err);
      },
    }
  );

  if (status === "loading") {
    return <VideoCardShimmer />;
  }

  const srcMatch = embed.match(/src=["'](.*?)["']/);
  const src = srcMatch ? srcMatch[1] : "";

  const channelThumbnail =
    data?.items?.[0]?.snippet.thumbnails.medium.url ?? "";

  return (
    <div className="flex flex-col gap-[1.2rem]" ref={innerRef}>
      <div
        className="relative"
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
      >
        {!isHover ? (
          <>
            <VideoCardThumbnail thumbnail={thumbnail} />
            <VideoCardDuration duration={duration} />
          </>
        ) : (
          <VideoCardPreview src={src} />
        )}
        {/* Sits over the preview iframe too, which would otherwise swallow the click */}
        <Link
          to={`/watch/${videoId}`}
          aria-label={videoTitle}
          className="absolute inset-0"
        />
      </div>
      <div className="flex gap-[1.2rem] items-start">
        <Link to={`/channel/${channelId}`} className="shrink-0">
          <VideoCardChannelImage src={channelThumbnail} alt={channelTitle} />
        </Link>

        <div className="flex flex-col min-w-0">
          <Link to={`/watch/${videoId}`}>
            <VideoCardTitle videoTitle={videoTitle} />
          </Link>
          <VideoCardMetdataBar
            channelId={channelId}
            channelTitle={channelTitle}
            viewCount={viewCount}
            publishedAt={publishedAt}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
