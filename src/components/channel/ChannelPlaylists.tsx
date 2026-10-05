import { FC } from "react";

import { useQuery } from "react-query";

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
      <p className="text-2xl">
        {status === "error" ? "Couldn't load playlists." : "No public playlists."}
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
        >
          <div className="relative">
            <img
              src={snippet.thumbnails.medium?.url}
              alt=""
              className="aspect-video w-full rounded-lg object-cover bg-[#272727]"
            />
            <span className="absolute right-1 bottom-1 bg-black bg-opacity-80 px-3 py-1 rounded-lg text-lg">
              {contentDetails.itemCount} videos
            </span>
          </div>
          <p className="text-[1.5rem] line-clamp-2 mt-2">{snippet.title}</p>
        </a>
      ))}
    </div>
  );
};

export default ChannelPlaylists;
