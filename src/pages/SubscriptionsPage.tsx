import { FC } from "react";

import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { MonitorPlayIcon } from "lucide-react";

import VideoGrid from "@/components/video-card/VideoGrid";
import BodyShimmer from "@/components/shimmer/BodyShimmer";

import { useAppSelector } from "@/store/store";
import { fetchLatestUploads } from "@/utils/helper";

const SubscriptionsPage: FC = () => {
  const channels = useAppSelector((store) => store.subscriptions.channels);
  const uploads = channels.map(({ uploads }) => uploads);

  // Same key as the bell menu, so they share one cached feed
  const { data: videos, status } = useQuery(
    ["subscriptionFeed", uploads.join()],
    () => fetchLatestUploads(uploads),
    { enabled: uploads.length > 0 }
  );

  if (!channels.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-[1.6rem] px-[2.4rem] text-center">
        <MonitorPlayIcon size={96} strokeWidth={1} className="text-yt-muted" />
        <h1 className="text-[2.4rem]">Don't miss new videos</h1>
        <p className="max-w-[48rem] text-[1.4rem] text-yt-muted">
          Subscribe to channels and their latest uploads show up here.
          Subscriptions are saved in this browser.
        </p>
        <Link
          to="/"
          className="flex items-center h-[3.6rem] px-[1.6rem] rounded-full bg-yt-surface hover:bg-yt-hover active:bg-yt-hover text-[1.4rem] font-medium"
        >
          Find channels
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-auto px-[1.6rem] sm:px-[2.4rem] pt-[2.4rem] pb-10">
      <div className="flex gap-[1.6rem] overflow-x-auto no-scrollbar pb-[2.4rem]">
        {channels.map(({ id, title, thumbnail }) => (
          <Link
            key={id}
            to={`/channel/${id}`}
            className="flex flex-col items-center gap-[0.6rem] w-[7.2rem] shrink-0 text-[1.2rem] text-yt-muted hover:text-yt-text"
          >
            <img src={thumbnail} alt="" className="w-[5.6rem] h-[5.6rem] rounded-full" />
            <span className="truncate max-w-full">{title}</span>
          </Link>
        ))}
      </div>
      <h1 className="text-[2rem] font-bold mb-[2.4rem]">Latest</h1>
      {status === "loading" ? (
        <BodyShimmer />
      ) : videos?.length ? (
        <VideoGrid videos={videos} />
      ) : (
        <p className="text-[1.4rem] text-yt-muted">
          {status === "error"
            ? "Couldn't load your subscriptions feed."
            : "No recent uploads from your subscriptions."}
        </p>
      )}
    </div>
  );
};

export default SubscriptionsPage;
