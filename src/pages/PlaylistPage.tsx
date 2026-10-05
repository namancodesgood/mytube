import { FC } from "react";

import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

import { PlayIcon } from "lucide-react";

import CompactVideoCard from "@/components/video-card/CompactVideoCard";

import { Thumbnail } from "@/interfaces/Thumbnail";
import { fetchPlaylistVideos, ytFetch } from "@/utils/helper";

type PlaylistInfo = {
  items?: {
    snippet: {
      title: string;
      description: string;
      channelId: string;
      channelTitle: string;
      thumbnails: { medium?: Thumbnail; high?: Thumbnail; maxres?: Thumbnail };
    };
    contentDetails: { itemCount: number };
  }[];
};

const fetchPlaylist = async (playlistId: string) => {
  const data = await ytFetch<PlaylistInfo>("playlists", {
    part: "snippet,contentDetails",
    id: playlistId,
  });
  return data.items?.[0] ?? null;
};

const PlaylistPage: FC = () => {
  const [params] = useSearchParams();
  const playlistId = params.get("list") ?? "";

  const { data: playlist, status } = useQuery(
    ["playlist", playlistId],
    () => fetchPlaylist(playlistId),
    { enabled: !!playlistId }
  );
  // ponytail: first 50 videos, page with nextPageToken for longer playlists
  const { data: videos, status: videosStatus } = useQuery(
    ["playlistVideos", playlistId],
    () => fetchPlaylistVideos(playlistId, 50),
    { enabled: !!playlistId }
  );

  if (status === "loading") {
    return (
      <div className="w-full flex flex-col lg:flex-row gap-[2.4rem] px-[1.6rem] sm:px-[2.4rem] pt-[2.4rem]">
        <div className="lg:w-[36rem] h-[40rem] shrink-0 rounded-2xl shimmer" />
        <div className="flex-1 flex flex-col gap-[0.8rem]">
          {[0, 1, 2, 3].map((idx) => (
            <div key={idx} className="h-[9.4rem] rounded-lg shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (!playlist) {
    return <p className="p-[2.4rem] text-[1.4rem]">Couldn't load this playlist.</p>;
  }

  const { snippet, contentDetails } = playlist;
  const cover =
    snippet.thumbnails.maxres?.url ??
    snippet.thumbnails.high?.url ??
    snippet.thumbnails.medium?.url;
  const firstVideo = videos?.[0];

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-[2.4rem] max-w-[128rem] mx-auto px-[1.6rem] sm:px-[2.4rem] pt-[2.4rem] pb-10">
        <aside className="w-full lg:w-[36rem] shrink-0 self-start lg:sticky lg:top-0 rounded-2xl p-[2.4rem] bg-gradient-to-b from-[#3a3a3a] to-yt-surface">
          <img
            src={cover}
            alt=""
            className="aspect-video w-full rounded-xl object-cover bg-yt-surface"
          />
          <h1 className="text-[2.8rem] leading-[3.8rem] font-bold break-words mt-[1.6rem]">
            {snippet.title}
          </h1>
          <Link
            to={`/channel/${snippet.channelId}`}
            className="block text-[1.4rem] font-medium mt-[0.8rem]"
          >
            {snippet.channelTitle}
          </Link>
          <p className="text-[1.2rem] text-yt-muted mt-[0.4rem]">
            Playlist • {contentDetails.itemCount} videos
          </p>
          {snippet.description && (
            <p className="text-[1.4rem] text-yt-muted whitespace-pre-line break-words line-clamp-4 mt-[1.2rem]">
              {snippet.description}
            </p>
          )}
          {firstVideo && (
            <Link
              to={`/watch/${firstVideo.id}`}
              className="flex items-center justify-center gap-[0.8rem] h-[3.6rem] mt-[1.6rem] rounded-full bg-yt-text text-yt-bg text-[1.4rem] font-medium hover:bg-[#d9d9d9] active:bg-[#d9d9d9]"
            >
              <PlayIcon size={20} fill="currentColor" />
              Play all
            </Link>
          )}
        </aside>

        <ol className="flex-1 min-w-0 flex flex-col gap-[0.8rem]">
          {videosStatus === "loading" &&
            [0, 1, 2, 3].map((idx) => (
              <li key={idx} className="h-[9.4rem] rounded-lg shimmer" />
            ))}
          {videosStatus !== "loading" && !videos?.length && (
            <li className="text-[1.4rem] text-yt-muted">
              No videos in this playlist.
            </li>
          )}
          {videos?.map(
            ({ id, snippet: video, statistics, contentDetails: details }, idx) => (
              <li key={`${id}-${idx}`} className="flex items-center gap-[0.8rem]">
                <span className="w-[2.4rem] shrink-0 text-center text-[1.4rem] text-yt-muted">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <CompactVideoCard
                    videoId={id}
                    thumbnail={video.thumbnails.medium.url}
                    title={video.title}
                    channelTitle={video.channelTitle}
                    viewCount={statistics.viewCount}
                    publishedAt={video.publishedAt}
                    duration={details.duration}
                  />
                </div>
              </li>
            )
          )}
        </ol>
      </div>
    </div>
  );
};

export default PlaylistPage;
