import { FC } from "react";

import { ListVideoIcon } from "lucide-react";

type Props = {
  src?: string;
  itemCount: number;
};

// Playlist cover with YouTube's stacked-card hint and the video count
const PlaylistThumbnail: FC<Props> = ({ src, itemCount }) => {
  return (
    <div>
      <div className="mx-[1.2rem] h-[0.4rem] rounded-t-lg bg-yt-hover" />
      <div className="relative">
        <img
          src={src}
          alt=""
          loading="lazy"
          className="aspect-video w-full rounded-xl object-cover bg-yt-surface"
        />
        <span className="absolute right-[0.8rem] bottom-[0.8rem] flex items-center gap-[0.4rem] bg-black/80 px-[0.6rem] py-[0.2rem] rounded-[0.4rem] text-[1.2rem] font-medium">
          <ListVideoIcon size={14} />
          {itemCount} videos
        </span>
      </div>
    </div>
  );
};

export default PlaylistThumbnail;
