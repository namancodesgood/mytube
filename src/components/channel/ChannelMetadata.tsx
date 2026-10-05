import { FC, useState } from "react";

import { formatTotalCount } from "@/utils/format";

import AboutChannelModal from "../modals/AboutChannelModal";

type Props = {
  title: string;
  avatar: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  country?: string;
  videoCount: string;
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
};

const ChannelMetadata: FC<Props> = ({
  title,
  avatar,
  description,
  customUrl,
  country,
  videoCount,
  viewCount,
  subscriberCount,
  hiddenSubscriberCount,
  publishedAt,
}) => {
  const [isModalOpen, setModalState] = useState(false);

  return (
    <>
      <div className="flex items-center gap-[1.6rem] mt-[1.6rem]">
        <img
          src={avatar}
          alt={title}
          className="w-[16rem] h-[16rem] shrink-0 rounded-full"
        />
        <div className="flex flex-col items-start gap-[0.8rem] min-w-0">
          <h1 className="text-[3.6rem] leading-[5rem] font-bold">{title}</h1>
          <p className="text-[1.4rem] leading-[2rem] text-yt-muted">
            <span className="text-yt-text font-medium">{customUrl}</span>
            {!hiddenSubscriberCount &&
              ` • ${formatTotalCount(subscriberCount)} subscribers`}
            {` • ${formatTotalCount(videoCount)} videos`}
          </p>
          {/* Like YouTube, the description teaser opens the About dialog */}
          <button
            type="button"
            onClick={() => setModalState(true)}
            className="flex max-w-[60rem] text-left text-[1.4rem] leading-[2rem] text-yt-muted"
          >
            <span className="truncate">{description}</span>
            <span className="shrink-0 text-yt-text font-medium">...more</span>
          </button>
          <button
            type="button"
            title="Coming soon"
            className="h-[3.6rem] px-[1.6rem] mt-[0.4rem] rounded-full bg-yt-text text-yt-bg text-[1.4rem] font-medium"
          >
            Subscribe
          </button>
        </div>
      </div>
      {isModalOpen && (
        <AboutChannelModal
          description={description}
          customUrl={customUrl}
          country={country}
          videoCount={videoCount}
          viewCount={viewCount}
          subscriberCount={subscriberCount}
          hiddenSubscriberCount={hiddenSubscriberCount}
          publishedAt={publishedAt}
          closeFn={() => setModalState(false)}
        />
      )}
    </>
  );
};

export default ChannelMetadata;
