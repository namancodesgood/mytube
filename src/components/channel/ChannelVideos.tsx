import { FC } from "react";

import { useQuery } from "react-query";

import VideoGrid from "@/components/video-card/VideoGrid";
import BodyShimmer from "@/components/shimmer/BodyShimmer";

import { fetchPlaylistVideos } from "@/utils/helper";

type Props = {
  uploadsPlaylistId: string;
};

const ChannelVideos: FC<Props> = ({ uploadsPlaylistId }) => {
  const { data: videos, status } = useQuery(
    ["channelUploads", uploadsPlaylistId],
    () => fetchPlaylistVideos(uploadsPlaylistId)
  );

  if (status === "loading") return <BodyShimmer />;

  if (!videos?.length) {
    return (
      <p className="text-[1.4rem] text-yt-muted">
        {status === "error"
          ? "Couldn't load videos."
          : "This channel has no videos yet."}
      </p>
    );
  }

  return <VideoGrid videos={videos} />;
};

export default ChannelVideos;
