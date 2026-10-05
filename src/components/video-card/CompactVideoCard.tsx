import { FC } from "react";

import { Link } from "react-router-dom";

import VideoCardDuration from "@/components/video-card/VideoCardDuration";

import { formatTotalCount, getFormattedTime } from "@/utils/format";

type Props = {
  videoId: string;
  thumbnail: string;
  title: string;
  channelTitle: string;
  viewCount: string;
  publishedAt: string;
  duration: string;
};

// The small side-by-side card from YouTube's "up next" column
const CompactVideoCard: FC<Props> = ({
  videoId,
  thumbnail,
  title,
  channelTitle,
  viewCount,
  publishedAt,
  duration,
}) => {
  return (
    <Link to={`/watch/${videoId}`} className="flex gap-[0.8rem]">
      <div className="relative w-[16.8rem] shrink-0">
        <img
          src={thumbnail}
          alt=""
          loading="lazy"
          className="aspect-video w-full rounded-lg object-cover bg-yt-surface"
        />
        <VideoCardDuration duration={duration} />
      </div>
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-[1.4rem] leading-[2rem] font-medium">
          {title}
        </h3>
        <p className="text-[1.2rem] leading-[1.8rem] text-yt-muted mt-[0.4rem]">
          {channelTitle}
        </p>
        <p className="text-[1.2rem] leading-[1.8rem] text-yt-muted">
          {formatTotalCount(viewCount)} views • {getFormattedTime(publishedAt)}
        </p>
      </div>
    </Link>
  );
};

export default CompactVideoCard;
