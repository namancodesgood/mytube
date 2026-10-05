import { FC } from "react";

import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import { DotIcon } from "lucide-react";

import { VideoData } from "@/interfaces/VideoData";
import {
  fetchChannelDetails,
  formatTotalCount,
  getFormattedDuration,
  ytFetch,
} from "@/utils/helper";

const fetchVideo = async (videoId: string) => {
  const data = await ytFetch<VideoData>("videos", {
    part: "snippet,contentDetails,statistics",
    id: videoId,
  });
  return data.items?.[0] ?? null;
};

const exactCount = (count?: string) =>
  count ? Number(count).toLocaleString() : "Hidden";

const VideoDetailsPage: FC = () => {
  const { videoId = "" } = useParams();

  const { data: video, status } = useQuery(["video", videoId], () =>
    fetchVideo(videoId)
  );
  const channelId = video?.snippet.channelId ?? "";
  const { data: channelData } = useQuery(
    ["channelDetails", channelId],
    () => fetchChannelDetails(channelId),
    { enabled: !!channelId }
  );

  if (status === "loading") {
    return (
      <div className="w-full px-6">
        <div className="aspect-video w-full max-w-[128rem] mx-auto shimmer" />
      </div>
    );
  }

  if (!video) {
    return <p className="text-2xl p-6">Couldn't load this video.</p>;
  }

  const { snippet, statistics, contentDetails } = video;
  const channel = channelData?.items?.[0];

  const stats = [
    ["Views", exactCount(statistics.viewCount)],
    ["Likes", exactCount(statistics.likeCount)],
    ["Comments", exactCount(statistics.commentCount)],
    ["Duration", getFormattedDuration(contentDetails.duration)],
    ["Published", new Date(snippet.publishedAt).toLocaleDateString()],
    ["Quality", contentDetails.definition.toUpperCase()],
    ["Captions", contentDetails.caption === "true" ? "Yes" : "No"],
  ];

  return (
    <div className="w-full overflow-y-auto px-6 pb-10">
      <div className="max-w-[128rem] mx-auto">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={snippet.title}
          className="w-full aspect-video rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <h1 className="text-4xl font-bold mt-4">{snippet.title}</h1>

        {channel && (
          <section className="flex items-center gap-6 mt-6 bg-[#212121] rounded-xl p-6">
            <Link to={`/channel/${channel.id}`} className="shrink-0">
              <img
                src={channel.snippet.thumbnails.medium.url}
                alt={channel.snippet.title}
                className="w-28 h-28 rounded-full"
              />
            </Link>
            <div className="flex flex-col gap-1 text-xl text-slate-300 min-w-0">
              <Link
                to={`/channel/${channel.id}`}
                className="text-3xl font-bold text-white"
              >
                {channel.snippet.title}
              </Link>
              <span className="flex flex-wrap items-center">
                {channel.snippet.customUrl}
                {!channel.statistics.hiddenSubscriberCount && (
                  <>
                    <DotIcon />
                    {formatTotalCount(channel.statistics.subscriberCount)}
                    &nbsp;subscribers
                  </>
                )}
                <DotIcon />
                {formatTotalCount(channel.statistics.videoCount)}&nbsp;videos
                <DotIcon />
                {formatTotalCount(channel.statistics.viewCount)}&nbsp;views
              </span>
              <span>
                {channel.snippet.country && `${channel.snippet.country} · `}
                Joined{" "}
                {new Date(channel.snippet.publishedAt).toLocaleDateString()}
              </span>
              <p className="line-clamp-2 text-2xl text-white mt-1">
                {channel.snippet.description}
              </p>
            </div>
          </section>
        )}

        <dl className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 mt-6">
          {stats.map(([label, value]) => (
            <div key={label} className="bg-[#212121] rounded-xl p-4">
              <dt className="text-lg text-slate-400">{label}</dt>
              <dd className="text-2xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="bg-[#212121] rounded-xl p-6 mt-6 text-2xl">
          <p className="whitespace-pre-line break-words">{snippet.description}</p>
          {snippet.tags && (
            <div className="flex flex-wrap gap-2 mt-4">
              {snippet.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#303030] rounded-full px-4 py-1 text-xl"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetailsPage;
