import { FC } from "react";

type Props = {
  thumbnail: string;
};

const VideoCardThumbnail: FC<Props> = ({ thumbnail }: Props) => {
  return (
    <img
      src={thumbnail}
      loading="lazy"
      className="aspect-video w-full rounded-xl object-cover bg-yt-surface"
      alt=""
    />
  );
};

export default VideoCardThumbnail;
