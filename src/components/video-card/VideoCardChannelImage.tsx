import { FC } from "react";

type Props = {
  src: string;
  alt: string;
};

const VideoCardChannelImage: FC<Props> = ({ src, alt }) => {
  return (
    <img
      className="w-[3.6rem] h-[3.6rem] rounded-full object-cover bg-yt-surface"
      src={src}
      alt={alt}
      loading="lazy"
    />
  );
};

export default VideoCardChannelImage;
