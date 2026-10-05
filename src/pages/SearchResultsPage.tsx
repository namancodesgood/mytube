import { FC } from "react";

import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";

import SubscribeButton from "@/components/buttons/SubscribeButton";
import VideoCardDuration from "@/components/video-card/VideoCardDuration";
import PlaylistThumbnail from "@/components/playlist/PlaylistThumbnail";

import { ChannelItem } from "@/interfaces/ChannelData";
import { Thumbnail } from "@/interfaces/Thumbnail";
import { VideoItem } from "@/interfaces/VideoData";
import { toSubscribedChannel } from "@/store/reducers/subscriptionsSlice";
import { fetchChannelDetails, fetchVideosByIds, ytFetch } from "@/utils/helper";
import { formatTotalCount, getFormattedTime } from "@/utils/format";

type SearchHits = {
  items?: {
    id: { videoId?: string; channelId?: string; playlistId?: string };
  }[];
};

type Playlist = {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium?: Thumbnail };
  };
  contentDetails: { itemCount: number };
};

// ponytail: first 20 results only; every extra page costs 1 of the 100 searches/day
const fetchResults = async (query: string) => {
  const search = await ytFetch<SearchHits>("search", {
    part: "id",
    q: query,
    maxResults: "20",
    regionCode: "IN",
  });
  const hits = search.items ?? [];
  const idsOf = (key: "videoId" | "channelId" | "playlistId") =>
    hits.flatMap(({ id }) => id[key] ?? []);

  // search.list only returns ids and escaped titles, so look every hit up
  const [videos, playlists] = await Promise.all([
    fetchVideosByIds(idsOf("videoId")),
    idsOf("playlistId").length
      ? ytFetch<{ items?: Playlist[] }>("playlists", {
          part: "snippet,contentDetails",
          id: idsOf("playlistId").join(","),
        })
      : { items: [] },
  ]);
  // One channels call covers channel results and the avatars beside videos
  const channelIds = [
    ...new Set([
      ...idsOf("channelId"),
      ...videos.map(({ snippet }) => snippet.channelId),
    ]),
  ];
  const channels = channelIds.length
    ? await fetchChannelDetails(channelIds.join(","))
    : { items: [] };

  return {
    hits,
    videos: new Map(videos.map((video) => [video.id, video])),
    channels: new Map((channels.items ?? []).map((channel) => [channel.id, channel])),
    playlists: new Map(
      (playlists.items ?? []).map((playlist) => [playlist.id, playlist])
    ),
  };
};

const VideoResult: FC<{ video: VideoItem; channel?: ChannelItem }> = ({
  video,
  channel,
}) => {
  const { id, snippet, statistics, contentDetails } = video;

  return (
    <div className="flex flex-col sm:flex-row gap-[1.2rem] sm:gap-[1.6rem]">
      <Link to={`/watch/${id}`} className="relative sm:w-[36rem] shrink-0">
        <img
          src={snippet.thumbnails.medium.url}
          alt=""
          loading="lazy"
          className="aspect-video w-full rounded-xl object-cover bg-yt-surface"
        />
        <VideoCardDuration duration={contentDetails.duration} />
      </Link>
      <div className="min-w-0 text-[1.2rem] leading-[1.8rem] text-yt-muted">
        <Link to={`/watch/${id}`}>
          <h3 className="text-[1.8rem] leading-[2.6rem] text-yt-text line-clamp-2">
            {snippet.title}
          </h3>
        </Link>
        <p>
          {formatTotalCount(statistics.viewCount)} views •{" "}
          {getFormattedTime(snippet.publishedAt)}
        </p>
        <Link
          to={`/channel/${snippet.channelId}`}
          className="flex items-center gap-[0.8rem] my-[0.8rem] sm:my-[1.2rem] hover:text-yt-text"
        >
          {channel && (
            <img
              src={channel.snippet.thumbnails.default.url}
              alt=""
              className="w-[2.4rem] h-[2.4rem] rounded-full"
            />
          )}
          {snippet.channelTitle}
        </Link>
        <p className="hidden sm:line-clamp-2">{snippet.description}</p>
      </div>
    </div>
  );
};

const ChannelResult: FC<{ channel: ChannelItem }> = ({ channel }) => {
  const { id, snippet, statistics } = channel;

  return (
    <div className="flex items-center gap-[1.6rem]">
      <Link
        to={`/channel/${id}`}
        className="flex justify-center sm:w-[36rem] shrink-0"
      >
        <img
          src={snippet.thumbnails.medium.url}
          alt=""
          className="w-[8.8rem] h-[8.8rem] sm:w-[13.6rem] sm:h-[13.6rem] rounded-full"
        />
      </Link>
      <div className="flex-1 min-w-0 text-[1.2rem] leading-[1.8rem] text-yt-muted">
        <Link
          to={`/channel/${id}`}
          className="block text-[1.8rem] leading-[2.6rem] text-yt-text truncate"
        >
          {snippet.title}
        </Link>
        <p>
          {snippet.customUrl}
          {!statistics.hiddenSubscriberCount &&
            ` • ${formatTotalCount(statistics.subscriberCount)} subscribers`}
        </p>
        <p className="hidden sm:line-clamp-2 mt-[0.4rem]">{snippet.description}</p>
      </div>
      <SubscribeButton channel={toSubscribedChannel(channel)} />
    </div>
  );
};

const PlaylistResult: FC<{ playlist: Playlist }> = ({ playlist }) => {
  const { id, snippet, contentDetails } = playlist;

  return (
    <Link
      to={`/playlist?list=${id}`}
      className="group flex flex-col sm:flex-row gap-[1.2rem] sm:gap-[1.6rem]"
    >
      <div className="sm:w-[36rem] shrink-0">
        <PlaylistThumbnail
          src={snippet.thumbnails.medium?.url}
          itemCount={contentDetails.itemCount}
        />
      </div>
      <div className="min-w-0 text-[1.2rem] leading-[1.8rem] text-yt-muted">
        <h3 className="text-[1.8rem] leading-[2.6rem] text-yt-text line-clamp-2">
          {snippet.title}
        </h3>
        <p>{snippet.channelTitle} • Playlist</p>
        <p className="mt-[0.8rem] font-medium group-hover:text-yt-text">
          View full playlist
        </p>
      </div>
    </Link>
  );
};

const ResultsShimmer = () => (
  <>
    {[0, 1, 2, 3].map((idx) => (
      <div
        key={idx}
        className="flex flex-col sm:flex-row gap-[1.2rem] sm:gap-[1.6rem]"
      >
        <div className="sm:w-[36rem] shrink-0 aspect-video rounded-xl shimmer" />
        <div className="flex flex-col gap-[0.8rem] flex-1">
          <div className="h-[1.8rem] w-[80%] rounded shimmer" />
          <div className="h-[1.2rem] w-[40%] rounded shimmer" />
          <div className="h-[1.2rem] w-[30%] rounded shimmer" />
        </div>
      </div>
    ))}
  </>
);

const SearchResultsPage: FC = () => {
  const [params] = useSearchParams();
  const query = params.get("search_query")?.trim() ?? "";

  const { data, status, error } = useQuery<
    Awaited<ReturnType<typeof fetchResults>>,
    Error
  >(["searchResults", query], () => fetchResults(query), {
    enabled: !!query,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex flex-col gap-[1.6rem] max-w-[128rem] mx-auto px-[1.6rem] sm:px-[2.4rem] pt-[1.6rem] pb-10">
        {!query && (
          <p className="text-[1.4rem] text-yt-muted">
            Type something in the search box.
          </p>
        )}
        {status === "loading" && <ResultsShimmer />}
        {error && (
          <p className="text-[1.4rem] text-yt-muted">
            Couldn't search: {error.message}
          </p>
        )}
        {data && !data.hits.length && (
          <p className="text-[1.4rem] text-yt-muted">
            No results for “{query}”.
          </p>
        )}
        {data?.hits.map(({ id }) => {
          if (id.videoId) {
            const video = data.videos.get(id.videoId);
            return (
              video && (
                <VideoResult
                  key={id.videoId}
                  video={video}
                  channel={data.channels.get(video.snippet.channelId)}
                />
              )
            );
          }
          if (id.channelId) {
            const channel = data.channels.get(id.channelId);
            return channel && <ChannelResult key={id.channelId} channel={channel} />;
          }
          const playlist = data.playlists.get(id.playlistId ?? "");
          return (
            playlist && <PlaylistResult key={playlist.id} playlist={playlist} />
          );
        })}
      </div>
    </div>
  );
};

export default SearchResultsPage;
