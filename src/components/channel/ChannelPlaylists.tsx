import { FC } from "react";

import { useQuery } from "react-query";

import { ListVideoIcon } from "lucide-react";

import BodyShimmer from "@/components/shimmer/BodyShimmer";

import { Thumbnail } from "@/interfaces/Thumbnail";
import { ytFetch } from "@/utils/helper";

type Props = {
  channelId: string;
};

type Playlists = {
  items?: {
    id: string;
    snippet: { title: string; thumbnails: { medium?: Thumbnail } };
    contentDetails: { itemCount: number };
  }[];
};

const ChannelPlaylists: FC<Props> = ({ channelId }) => {
  const { data, status } = useQuery(["channelPlaylists", channelId], () =>
    ytFetch<Playlists>("playlists", {
      part: "snippet,contentDetails",
      channelId,
      maxResults: "24",
    })
  );

  if (status === "loading") return <BodyShimmer />;

  if (!data?.items?.length) {
    return (
      <p className="text-[1.4rem] text-yt-muted">
        {status === "error"
          ? "Couldn't load playlists."
          : "This channel has no public playlists."}
      </p>
    );
  }

  // No playlist page in the app yet, so playlists open on YouTube
  return (
    <div className="video-grid">
      {data.items.map(({ id, snippet, contentDetails }) => (
        <a
          key={id}
          href={`https://www.youtube.com/playlist?list=${id}`}
          target="_blank"
          rel="noreferrer"
          className="group"
        >
          {/* YouTube's stacked-card hint above a playlist thumbnail */}
          <div className="mx-[1.2rem] h-[0.4rem] rounded-t-lg bg-yt-hover" />
          <div className="relative">
            <img
              src={snippet.thumbnails.medium?.url}
              alt=""
              loading="lazy"
              className="aspect-video w-full rounded-xl object-cover bg-yt-surface"
            />
            <span className="absolute right-[0.8rem] bottom-[0.8rem] flex items-center gap-[0.4rem] bg-black/80 px-[0.6rem] py-[0.2rem] rounded-[0.4rem] text-[1.2rem] font-medium">
              <ListVideoIcon size={14} />
              {contentDetails.itemCount} videos
            </span>
          </div>
          <h3 className="text-[1.4rem] leading-[2rem] font-medium line-clamp-2 mt-[1.2rem]">
            {snippet.title}
          </h3>
          <p className="text-[1.4rem] text-yt-muted group-hover:text-yt-text">
            View full playlist
          </p>
        </a>
      ))}
    </div>
  );
};

export default ChannelPlaylists;
