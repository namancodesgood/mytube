import { FC } from "react";

import { Link } from "react-router-dom";

import { formatTotalCount, getFormattedTime } from "@/utils/format";

type Props = {
  channelId: string;
  channelTitle: string;
  viewCount: string;
  publishedAt: string;
};

const VideoCardMetdataBar: FC<Props> = ({
  channelId,
  channelTitle,
  viewCount,
  publishedAt,
}) => {
  return (
    <div className="text-[1.4rem] leading-[2rem] text-yt-muted mt-[0.4rem]">
      <Link to={`/channel/${channelId}`} className="hover:text-yt-text">
        {channelTitle}
      </Link>
      <p>
        {formatTotalCount(viewCount)} views • {getFormattedTime(publishedAt)}
      </p>
    </div>
  );
};

export default VideoCardMetdataBar;
