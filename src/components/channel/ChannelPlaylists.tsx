import { FC } from "react";

import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import BodyShimmer from "@/components/shimmer/BodyShimmer";
import PlaylistThumbnail from "@/components/playlist/PlaylistThumbnail";

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

  return (
    <div className="video-grid">
      {data.items.map(({ id, snippet, contentDetails }) => (
        <Link key={id} to={`/playlist?list=${id}`} className="group">
          <PlaylistThumbnail
            src={snippet.thumbnails.medium?.url}
            itemCount={contentDetails.itemCount}
          />
          <h3 className="text-[1.4rem] leading-[2rem] font-medium line-clamp-2 mt-[1.2rem]">
            {snippet.title}
          </h3>
          <p className="text-[1.4rem] text-yt-muted group-hover:text-yt-text">
            View full playlist
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ChannelPlaylists;
