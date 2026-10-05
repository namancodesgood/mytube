import { FC, ReactNode, useState } from "react";

import { useQuery } from "react-query";

import { ChevronDownIcon, ThumbsUpIcon } from "lucide-react";

import { ytFetch } from "@/utils/helper";
import { formatTotalCount, getFormattedTime } from "@/utils/format";

type CommentSnippet = {
  authorDisplayName: string;
  authorProfileImageUrl: string;
  textOriginal: string;
  likeCount: number;
  publishedAt: string;
};

type CommentThreads = {
  items?: {
    id: string;
    snippet: {
      totalReplyCount: number;
      topLevelComment: { snippet: CommentSnippet };
    };
  }[];
};

type Comments = {
  items?: { id: string; snippet: CommentSnippet }[];
};

const CommentRow: FC<{
  comment: CommentSnippet;
  small?: boolean;
  children?: ReactNode;
}> = ({ comment, small, children }) => (
  <div className="flex gap-[1.6rem]">
    <img
      src={comment.authorProfileImageUrl}
      alt=""
      loading="lazy"
      className={`${
        small ? "w-[2.4rem] h-[2.4rem]" : "w-[4rem] h-[4rem]"
      } shrink-0 rounded-full bg-yt-surface`}
    />
    <div className="flex-1 min-w-0 text-[1.4rem] leading-[2rem]">
      <p className="text-[1.3rem]">
        <span className="font-medium">{comment.authorDisplayName}</span>
        <span className="text-yt-muted ml-[0.4rem]">
          {getFormattedTime(comment.publishedAt)}
        </span>
      </p>
      <p className="whitespace-pre-line break-words">{comment.textOriginal}</p>
      <p className="flex items-center gap-[0.6rem] text-[1.2rem] text-yt-muted mt-[0.4rem]">
        <ThumbsUpIcon size={16} />
        {comment.likeCount > 0 && formatTotalCount(String(comment.likeCount))}
      </p>
      {children}
    </div>
  </div>
);

// ponytail: first 20 replies, page with nextPageToken for busier threads
const Replies: FC<{ parentId: string }> = ({ parentId }) => {
  const { data, status } = useQuery(["replies", parentId], () =>
    ytFetch<Comments>("comments", { part: "snippet", parentId, maxResults: "20" })
  );

  if (status === "loading") {
    return <div className="h-[2rem] w-[40%] rounded shimmer mt-[1.2rem]" />;
  }

  if (status === "error") {
    return (
      <p className="text-[1.2rem] text-yt-muted mt-[0.8rem]">
        Couldn't load replies.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-[1.2rem] mt-[1.2rem]">
      {data?.items?.map(({ id, snippet }) => (
        <li key={id}>
          <CommentRow comment={snippet} small />
        </li>
      ))}
    </ul>
  );
};

const CommentThread: FC<{
  threadId: string;
  comment: CommentSnippet;
  replyCount: number;
}> = ({ threadId, comment, replyCount }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <li>
      <CommentRow comment={comment}>
        {replyCount > 0 && (
          <button
            type="button"
            aria-expanded={showReplies}
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-[0.6rem] h-[3.6rem] px-[1.2rem] -ml-[1.2rem] mt-[0.4rem] rounded-full text-[1.4rem] font-medium text-[#3ea6ff] hover:bg-[#263850] active:bg-[#263850]"
          >
            <ChevronDownIcon
              size={20}
              className={showReplies ? "rotate-180" : ""}
            />
            {replyCount.toLocaleString()} {replyCount === 1 ? "reply" : "replies"}
          </button>
        )}
        {showReplies && <Replies parentId={threadId} />}
      </CommentRow>
    </li>
  );
};

type Props = {
  videoId: string;
  commentCount?: string;
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
        {data?.items?.map(({ id, snippet }) => (
          <CommentThread
            key={id}
            threadId={id}
            comment={snippet.topLevelComment.snippet}
            replyCount={snippet.totalReplyCount}
          />
        ))}
      </ul>
    </section>
  );
};

export default VideoComments;
