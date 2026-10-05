import { FC, useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { BellIcon } from "lucide-react";

import { useAppSelector } from "@/store/store";
import { fetchLatestUploads } from "@/utils/helper";
import { getFormattedTime } from "@/utils/format";

// YouTube's bell, fed by the channels subscribed to in this browser
const NotificationsMenu: FC = () => {
  const [isOpen, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const channels = useAppSelector((store) => store.subscriptions.channels);
  const uploads = channels.map(({ uploads }) => uploads);
  const avatars = new Map(channels.map(({ id, thumbnail }) => [id, thumbnail]));

  // Same key as the Subscriptions page, so they share one cached feed
  const { data: videos, status } = useQuery(
    ["subscriptionFeed", uploads.join()],
    () => fetchLatestUploads(uploads),
    { enabled: isOpen && uploads.length > 0 }
  );

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        className="p-[0.8rem] rounded-full hover-bg"
      >
        <BellIcon size={24} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-[0.4rem] w-[48rem] max-w-[calc(100vw-2.4rem)] max-h-[70vh] overflow-y-auto overscroll-contain rounded-xl bg-yt-menu shadow-lg py-[0.8rem]">
          <h2 className="px-[1.6rem] pb-[0.8rem] text-[1.6rem] border-b border-yt-hover">
            Notifications
          </h2>
          {!channels.length && (
            <p className="p-[1.6rem] text-[1.4rem] text-yt-muted">
              Subscribe to channels and their new videos show up here.
            </p>
          )}
          {status === "loading" && (
            <div className="flex flex-col gap-[1.2rem] p-[1.6rem]">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="h-[4.8rem] rounded shimmer" />
              ))}
            </div>
          )}
          {videos?.slice(0, 12).map(({ id, snippet }) => (
            <Link
              key={id}
              to={`/watch/${id}`}
              onClick={() => setOpen(false)}
              className="flex items-start gap-[1.6rem] px-[1.6rem] py-[1.2rem] hover:bg-yt-hover active:bg-yt-hover"
            >
              <img
                src={avatars.get(snippet.channelId)}
                alt=""
                className="w-[4.8rem] h-[4.8rem] shrink-0 rounded-full bg-yt-surface"
              />
              <div className="flex-1 min-w-0 text-[1.4rem] leading-[2rem]">
                <p className="line-clamp-3">
                  {snippet.channelTitle} uploaded: {snippet.title}
                </p>
                <p className="text-[1.2rem] text-yt-muted">
                  {getFormattedTime(snippet.publishedAt)}
                </p>
              </div>
              <img
                src={snippet.thumbnails.medium.url}
                alt=""
                className="w-[8.6rem] aspect-video shrink-0 rounded object-cover"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
