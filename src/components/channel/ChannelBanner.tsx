import { FC } from "react";

type Props = {
  src: string;
  alt: string;
};

const ChannelBanner: FC<Props> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full aspect-[6.2/1] object-cover rounded-xl bg-yt-surface"
    />
  );
};

export default ChannelBanner;
