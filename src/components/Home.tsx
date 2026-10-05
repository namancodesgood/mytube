import { FC, useEffect, useRef, useState } from "react";

import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";

import VideoGrid from "@/components/video-card/VideoGrid";
import BodyShimmer from "@/components/shimmer/BodyShimmer";

import { VideoData } from "@/interfaces/VideoData";
import { HOME_CATEGORIES } from "@/utils/constants";
import { ytFetch } from "@/utils/helper";

const fetchPopularVideos = (pageToken: string, categoryId: string) =>
  ytFetch<VideoData>("videos", {
    part: "snippet,contentDetails,statistics,player",
    chart: "mostPopular",
    regionCode: "IN",
    maxResults: "24",
    pageToken,
    ...(categoryId ? { videoCategoryId: categoryId } : {}),
  });

type Props = {
  categoryId?: string; // a fixed category (the Music page) replaces the chips
  title?: string;
};

const Home: FC<Props> = ({ categoryId: fixedCategory, title }) => {
  const [selectedChip, setSelectedChip] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const categoryId = fixedCategory ?? selectedChip;

  const { data, status, hasNextPage, fetchNextPage } =
    useInfiniteQuery<VideoData>(
      ["popularVideos", categoryId],
      ({ pageParam = "" }) => fetchPopularVideos(pageParam, categoryId),
      {
        getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
      }
    );
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const selectChip = (id: string) => {
    setSelectedChip(id);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  // Pages of a live chart can overlap, so drop repeats
  const videos = [
    ...new Map(
      (data?.pages.flatMap((page) => page.items) ?? []).map((video) => [
        video.id,
        video,
      ])
    ).values(),
  ];

  return (
    <div ref={scrollRef} className="w-full overflow-y-auto pb-10">
      {fixedCategory === undefined ? (
        <div className="sticky top-0 z-10 flex gap-[1.2rem] overflow-x-auto no-scrollbar bg-yt-bg px-[1.6rem] sm:px-[2.4rem] py-[1.2rem]">
          {HOME_CATEGORIES.map(({ id, title: chipTitle }) => (
            <button
              key={chipTitle}
              type="button"
              aria-pressed={id === selectedChip}
              onClick={() => selectChip(id)}
              className={`shrink-0 h-[3.2rem] px-[1.2rem] rounded-[0.8rem] text-[1.4rem] font-medium ${
                id === selectedChip
                  ? "bg-yt-text text-yt-bg"
                  : "bg-yt-surface hover:bg-yt-hover active:bg-yt-hover"
              }`}
            >
              {chipTitle}
            </button>
          ))}
        </div>
      ) : (
        <h1 className="text-[2rem] font-bold px-[1.6rem] sm:px-[2.4rem] pt-[2.4rem] pb-[1.2rem]">
          {title}
        </h1>
      )}
      <div className="px-[1.6rem] sm:px-[2.4rem] pt-[1.2rem]">
        {status === "loading" ? (
          <BodyShimmer />
        ) : videos.length ? (
          <VideoGrid videos={videos} sentinelRef={ref} />
        ) : (
          <p className="text-[1.4rem] text-yt-muted">
            {status === "error"
              ? "Couldn't load videos. Please try again later."
              : "Nothing is trending here right now."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
