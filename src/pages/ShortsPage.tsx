import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { useInView } from "react-intersection-observer";

import {
  MessageSquareIcon,
  PlayIcon,
  ThumbsUpIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";

import { VideoItem } from "@/interfaces/VideoData";
import { fetchVideosByIds, ytFetch } from "@/utils/helper";
import { formatTotalCount, getDurationSeconds } from "@/utils/format";

type SearchHits = {
  items?: { id: { videoId?: string } }[];
};

// The API has no Shorts flag: search "#shorts" among short videos and keep those up to 3 minutes
const fetchShorts = async () => {
  const search = await ytFetch<SearchHits>("search", {
    part: "id",
    q: "#shorts",
    type: "video",
    videoDuration: "short",
    regionCode: "IN",
    maxResults: "25",
  });
  const videos = await fetchVideosByIds(
    search.items?.flatMap(({ id }) => id.videoId ?? []) ?? []
  );
  return videos.filter(
    ({ contentDetails }) => getDurationSeconds(contentDetails.duration) <= 180
  );
};

type PlayerCommand = "playVideo" | "pauseVideo" | "mute" | "unMute";

type ShortProps = {
  video: VideoItem;
  isMuted: boolean;
  onToggleMute: () => void;
};

const Short: FC<ShortProps> = ({ video, isMuted, onToggleMute }) => {
  const { ref, inView } = useInView({ threshold: 0.6 });
  const [isActive, setActive] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const { id, snippet, statistics } = video;

  // Only the Short on screen gets a player, mounted once the snap settles rather than mid-swipe
  useEffect(() => {
    if (!inView) {
      setActive(false);
      setPaused(false);
      return;
    }
    const timer = setTimeout(() => setActive(true), 150);
    return () => clearTimeout(timer);
  }, [inView]);

  // The embed takes IFrame Player API commands over postMessage (enablejsapi=1)
  const command = useCallback(
    (func: PlayerCommand) =>
      playerRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args: [] }),
        "https://www.youtube.com"
      ),
    []
  );

  // Players start muted (the only autoplay every browser allows), then follow the mute button
  const syncSound = () => {
    if (isMuted) return;
    command("unMute");
    // ponytail: one retry instead of waiting for the player's ready event; use the IFrame API script if this gets flaky
    setTimeout(() => command("unMute"), 1000);
  };

  useEffect(() => {
    command(isMuted ? "mute" : "unMute");
  }, [isMuted, command]);

  const togglePause = () => {
    command(isPaused ? "playVideo" : "pauseVideo");
    setPaused(!isPaused);
  };

  return (
    <section
      ref={ref}
      className="snap-start snap-always h-full flex flex-col md:flex-row items-center md:items-end justify-center gap-[1.2rem] md:gap-[1.6rem] p-[1.2rem]"
    >
      <div className="relative h-[calc(100%-10rem)] md:h-full max-w-full aspect-[9/16] shrink-0 overflow-hidden rounded-xl bg-black">
        <img
          src={snippet.thumbnails.maxres?.url ?? snippet.thumbnails.high.url}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {isActive && (
          <iframe
            ref={playerRef}
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&enablejsapi=1`}
            title={snippet.title}
            onLoad={syncSound}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        )}
        {/* Sits over the player so wheel and swipe scroll the feed (an iframe would swallow them); a tap pauses, like YouTube Shorts */}
        <button
          type="button"
          aria-label={isPaused ? "Play" : "Pause"}
          onClick={togglePause}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isPaused && (
            <span className="p-[1.6rem] rounded-full bg-black/50">
              <PlayIcon size={36} fill="currentColor" />
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label={isMuted ? "Unmute" : "Mute"}
          onClick={onToggleMute}
          className="absolute top-[1.2rem] right-[1.2rem] p-[0.8rem] rounded-full bg-black/50 hover:bg-black/70 active:bg-black/70"
        >
          {isMuted ? <VolumeXIcon size={22} /> : <Volume2Icon size={22} />}
        </button>
      </div>
      <div className="w-full max-w-[40rem] md:w-[28rem] md:pb-[1.2rem] text-[1.4rem] leading-[2rem]">
        <h2 className="font-medium line-clamp-2">{snippet.title}</h2>
        <Link
          to={`/channel/${snippet.channelId}`}
          className="block text-yt-muted hover:text-yt-text mt-[0.4rem]"
        >
          {snippet.channelTitle}
        </Link>
        <p className="flex items-center gap-[1.6rem] text-[1.2rem] text-yt-muted mt-[0.4rem]">
          <span className="flex items-center gap-[0.6rem]">
            <ThumbsUpIcon size={16} />
            {statistics.likeCount ? formatTotalCount(statistics.likeCount) : "—"}
          </span>
          <span className="flex items-center gap-[0.6rem]">
            <MessageSquareIcon size={16} />
            {statistics.commentCount
              ? formatTotalCount(statistics.commentCount)
              : "—"}
          </span>
          <span>{formatTotalCount(statistics.viewCount)} views</span>
        </p>
      </div>
    </section>
  );
};

const ShortsPage: FC = () => {
  const [isMuted, setMuted] = useState(true);

  // A search costs 1 of the 100 searches/day, so keep the feed for half an hour
  const { data: shorts, status, error } = useQuery<VideoItem[], Error>(
    ["shorts"],
    fetchShorts,
    { staleTime: 30 * 60 * 1000, cacheTime: 30 * 60 * 1000 }
  );

  if (status === "loading") {
    return (
      <div className="w-full h-full flex justify-center p-[1.2rem]">
        <div className="h-full max-w-full aspect-[9/16] rounded-xl shimmer" />
      </div>
    );
  }

  if (!shorts?.length) {
    return (
      <p className="p-[2.4rem] text-[1.4rem] text-yt-muted">
        {error ? `Couldn't load Shorts: ${error.message}` : "No Shorts right now."}
      </p>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto overscroll-contain snap-y snap-mandatory">
      {shorts.map((video) => (
        <Short
          key={video.id}
          video={video}
          isMuted={isMuted}
          onToggleMute={() => setMuted(!isMuted)}
        />
      ))}
    </div>
  );
};

export default ShortsPage;
