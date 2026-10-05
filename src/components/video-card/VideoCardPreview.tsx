import { FC } from "react";

type Props = {
  src: string;
};

const VideoCardPreview: FC<Props> = ({ src }) => {
  return (
    <iframe
      src={`https:${src}?autoplay=1&mute=1&controls=0&rel=0&loop=1`}
      className="rounded-xl w-full aspect-video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    ></iframe>
  );
};

export default VideoCardPreview;
