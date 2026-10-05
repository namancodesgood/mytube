import { FC } from "react";

import { useQuery } from "react-query";

import { ThumbsUpIcon } from "lucide-react";

import { ytFetch } from "@/utils/helper";
import { formatTotalCount, getFormattedTime } from "@/utils/format";

type Props = {
  videoId: string;
  commentCount?: string;
};

type CommentThreads = {
  items?: {
    id: string;
    snippet: {
      totalReplyCount: number;
      topLevelComment: {
        snippet: {
          authorDisplayName: string;
          authorProfileImageUrl: string;
          textOriginal: string;
          likeCount: number;
          publishedAt: string;
        };
      };
    };
  }[];
};

const VideoComments: FC<Props> = ({ videoId, commentCount }) => {
  const { data, status } = useQuery(["comments", videoId], () =>
    ytFetch<CommentThreads>("commentThreads", {
      part: "snippet",
      videoId,
      maxResults: "20",
    })
  );

  return (
    <section className="mt-[2.4rem]">
      <h2 className="text-[2rem] font-bold">
        {commentCount
          ? `${Number(commentCount).toLocaleString()} Comments`
          : "Comments"}
      </h2>
      {status === "error" && (
        <p className="text-[1.4rem] text-yt-muted mt-[1.6rem]">
          Comments are turned off or couldn't load.
        </p>
      )}
      <ul className="flex flex-col gap-[1.6rem] mt-[2.4rem]">
        {status === "loading" &&
          Array.from({ length: 4 }, (_, idx) => (
            <li key={idx} className="flex gap-[1.6rem]">
              <div className="w-[4rem] h-[4rem] shrink-0 rounded-full shimmer" />
              <div className="flex flex-col gap-[0.8rem] w-full pt-[0.2rem]">
                <div className="h-[1.3rem] w-[20%] rounded shimmer" />
                <div className="h-[1.4rem] w-[70%] rounded shimmer" />
              </div>
            </li>
          ))}
        {data?.items?.map(({ id, snippet }) => {
          const comment = snippet.topLevelComment.snippet;

          return (
            <li key={id} className="flex gap-[1.6rem]">
              <img
                src={comment.authorProfileImageUrl}
                alt=""
                loading="lazy"
                className="w-[4rem] h-[4rem] shrink-0 rounded-full bg-yt-surface"
              />
              <div className="min-w-0 text-[1.4rem] leading-[2rem]">
                <p className="text-[1.3rem]">
                  <span className="font-medium">{comment.authorDisplayName}</span>
                  <span className="text-yt-muted ml-[0.4rem]">
                    {getFormattedTime(comment.publishedAt)}
                  </span>
                </p>
                <p className="whitespace-pre-line break-words">
                  {comment.textOriginal}
                </p>
                <p className="flex items-center gap-[1.6rem] text-[1.2rem] text-yt-muted mt-[0.4rem]">
                  <span className="flex items-center gap-[0.6rem]">
                    <ThumbsUpIcon size={16} />
                    {comment.likeCount > 0 &&
                      formatTotalCount(String(comment.likeCount))}
                  </span>
                  {snippet.totalReplyCount > 0 && (
                    <span className="text-[#3ea6ff] font-medium">
                      {snippet.totalReplyCount.toLocaleString()} replies
                    </span>
                  )}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default VideoComments;
