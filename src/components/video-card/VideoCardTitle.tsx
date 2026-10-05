import { FC } from "react";

type Props = {
  videoTitle: string;
};

const VideoCardTitle: FC<Props> = ({ videoTitle }) => {
  return (
    <h3
      className="line-clamp-2 text-[1.6rem] leading-[2.2rem] font-medium"
      title={videoTitle}
    >
      {videoTitle}
    </h3>
  );
};

export default VideoCardTitle;
