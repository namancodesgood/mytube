import { FC, useState } from "react";

import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import CompactVideoCard from "@/components/video-card/CompactVideoCard";
import SubscribeButton from "@/components/buttons/SubscribeButton";
import VideoComments from "@/components/watch/VideoComments";

import { VideoData } from "@/interfaces/VideoData";
import { toSubscribedChannel } from "@/store/reducers/subscriptionsSlice";
import {
  fetchChannelDetails,
  fetchPlaylistVideos,
  ytFetch,
} from "@/utils/helper";
import { formatTotalCount, getFormattedDuration } from "@/utils/format";

const fetchVideo = async (videoId: string) => {
  const data = await ytFetch<VideoData>("videos", {
    part: "snippet,contentDetails,statistics",
    id: videoId,
  });
  return data.items?.[0] ?? null;
};

const formatDate = (timestamp: string) =>
  new Date(timestamp).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const WatchShimmer = () => (
  <div className="w-full px-[1.2rem] sm:px-[2.4rem] pt-[1.2rem] sm:pt-[2.4rem]">
    <div className="max-w-[128rem]">
      <div className="aspect-video w-full rounded-xl shimmer" />
      <div className="h-[2.4rem] w-[60%] rounded shimmer mt-[1.6rem]" />
      <div className="flex items-center gap-[1.2rem] mt-[1.6rem]">
        <div className="w-[4rem] h-[4rem] rounded-full shimmer" />
        <div className="h-[1.6rem] w-[20rem] rounded shimmer" />
      </div>
      <div className="h-[10rem] w-full rounded-xl shimmer mt-[1.6rem]" />
    </div>
  </div>
);

const Watch: FC<{ videoId: string }> = ({ videoId }) => {
  const [isExpanded, setExpanded] = useState(false);

  const { data: video, status } = useQuery(["video", videoId], () =>
    fetchVideo(videoId)
  );
  const channelId = video?.snippet.channelId ?? "";
  const { data: channelData } = useQuery(
    ["channelDetails", channelId],
    () => fetchChannelDetails(channelId),
    { enabled: !!channelId }
  );
  const channel = channelData?.items?.[0];
  const uploadsId = channel?.contentDetails.relatedPlaylists.uploads ?? "";
  const { data: uploads } = useQuery(
    ["channelUploads", uploadsId],
    () => fetchPlaylistVideos(uploadsId),
    { enabled: !!uploadsId }
  );

  if (status === "loading") return <WatchShimmer />;

  if (!video) {
    return <p className="p-[2.4rem] text-[1.4rem]">Couldn't load this video.</p>;
  }

  const { snippet, statistics, contentDetails } = video;
  const moreVideos = uploads?.filter(({ id }) => id !== videoId) ?? [];
  const facts = [
    getFormattedDuration(contentDetails.duration),
    contentDetails.definition.toUpperCase(),
    contentDetails.caption === "true" ? "CC" : "",
  ].filter(Boolean);

  return (
    <div className="w-full overflow-y-auto">
      <div className="flex flex-col xl:flex-row gap-[2.4rem] max-w-[176rem] mx-auto px-[1.2rem] sm:px-[2.4rem] pt-[1.2rem] sm:pt-[2.4rem] pb-10">
        <main className="flex-1 min-w-0">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={snippet.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <h1 className="text-[2rem] leading-[2.8rem] font-bold mt-[1.2rem]">
            {snippet.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-[1.2rem] mt-[1.2rem]">
            <div className="flex items-center gap-[1.2rem] min-w-0">
              <Link to={`/channel/${channelId}`} className="shrink-0">
                {channel ? (
                  <img
                    src={channel.snippet.thumbnails.default.url}
                    alt={snippet.channelTitle}
                    className="w-[4rem] h-[4rem] rounded-full"
                  />
                ) : (
                  <div className="w-[4rem] h-[4rem] rounded-full shimmer" />
                )}
              </Link>
              <div className="min-w-0">
                <Link
                  to={`/channel/${channelId}`}
                  className="block text-[1.6rem] leading-[2.2rem] font-medium truncate"
                >
                  {snippet.channelTitle}
                </Link>
                {channel && !channel.statistics.hiddenSubscriberCount && (
                  <p className="text-[1.2rem] leading-[1.8rem] text-yt-muted">
                    {formatTotalCount(channel.statistics.subscriberCount)}{" "}
                    subscribers
                  </p>
                )}
              </div>
              {channel && (
                <SubscribeButton
                  channel={toSubscribedChannel(channel)}
                  className="ml-[1.2rem]"
                />
              )}
            </div>
            <div className="flex items-center h-[3.6rem] rounded-full bg-yt-surface text-[1.4rem] font-medium">
              <span
                className="flex items-center gap-[0.8rem] h-full px-[1.6rem] border-r border-yt-hover"
                title={
                  statistics.likeCount
                    ? `${Number(statistics.likeCount).toLocaleString()} likes`
                    : "Likes are hidden"
                }
              >
                <ThumbsUpIcon size={20} />
                {statistics.likeCount
                  ? formatTotalCount(statistics.likeCount)
                  : "Like"}
              </span>
              <span className="flex items-center h-full px-[1.6rem]">
                <ThumbsDownIcon size={20} />
              </span>
            </div>
          </div>

          {/* Description box: stats in bold, then the text, tags and the creator */}
          <div className="bg-yt-surface rounded-xl p-[1.2rem] mt-[1.2rem] text-[1.4rem] leading-[2rem]">
            <p className="font-medium">
              {Number(statistics.viewCount).toLocaleString()} views&nbsp;&nbsp;
              {formatDate(snippet.publishedAt)}&nbsp;&nbsp;{facts.join(" · ")}
            </p>
            <p
              className={`whitespace-pre-line break-words mt-[0.4rem] ${
                isExpanded ? "" : "line-clamp-3"
              }`}
            >
              {snippet.description}
            </p>
            <button
              type="button"
              onClick={() => setExpanded(!isExpanded)}
              className="font-medium mt-[0.4rem]"
            >
              {isExpanded ? "Show less" : "...more"}
            </button>
            {snippet.tags && (
              <p className="text-[#3ea6ff] break-words mt-[1.2rem]">
                {snippet.tags
                  .map((tag) => `#${tag.replace(/\s+/g, "")}`)
                  .join(" ")}
              </p>
            )}
            {channel && (
              <div className="flex items-start gap-[1.6rem] border-t border-yt-hover mt-[1.6rem] pt-[1.6rem]">
                <img
                  src={channel.snippet.thumbnails.medium.url}
                  alt=""
                  className="w-[5.6rem] h-[5.6rem] shrink-0 rounded-full"
                />
                <div className="min-w-0">
                  <Link
                    to={`/channel/${channel.id}`}
                    className="text-[1.6rem] font-bold"
                  >
                    {channel.snippet.title}
                  </Link>
                  <p className="text-yt-muted">
                    {[
                      channel.snippet.customUrl,
                      !channel.statistics.hiddenSubscriberCount &&
                        `${formatTotalCount(channel.statistics.subscriberCount)} subscribers`,
                      `${formatTotalCount(channel.statistics.videoCount)} videos`,
                      `${formatTotalCount(channel.statistics.viewCount)} views`,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>
                  <p className="text-yt-muted">
                    {channel.snippet.country && `${channel.snippet.country} • `}
                    Joined {formatDate(channel.snippet.publishedAt)}
                  </p>
                  <p className="line-clamp-2 mt-[0.4rem]">
                    {channel.snippet.description}
                  </p>
                  <Link
                    to={`/channel/${channel.id}`}
                    className="inline-flex items-center h-[3.6rem] px-[1.6rem] mt-[1.2rem] rounded-full border border-yt-hover font-medium hover:bg-yt-hover"
                  >
                    Videos
                  </Link>
                </div>
              </div>
            )}
          </div>

          <VideoComments
            videoId={videoId}
            commentCount={statistics.commentCount}
          />
        </main>

        <aside className="xl:w-[40.2rem] shrink-0 flex flex-col gap-[0.8rem]">
          {moreVideos.length > 0 && (
            <h2 className="text-[1.6rem] font-medium">
              More from {snippet.channelTitle}
            </h2>
          )}
          {moreVideos.map(
            ({
              id,
              snippet: upload,
              statistics: uploadStats,
              contentDetails: uploadDetails,
            }) => (
              <CompactVideoCard
                key={id}
                videoId={id}
                thumbnail={upload.thumbnails.medium.url}
                title={upload.title}
                channelTitle={upload.channelTitle}
                viewCount={uploadStats.viewCount}
                publishedAt={upload.publishedAt}
                duration={uploadDetails.duration}
              />
            )
          )}
        </aside>
      </div>
    </div>
  );
};

const VideoDetailsPage: FC = () => {
  const { videoId = "" } = useParams();

  // Keyed so scroll position and "...more" reset when another video opens
  return <Watch key={videoId} videoId={videoId} />;
};

export default VideoDetailsPage;
