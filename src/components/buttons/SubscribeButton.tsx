import { FC } from "react";

import { BellIcon } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  SubscribedChannel,
  toggleSubscription,
} from "@/store/reducers/subscriptionsSlice";

type Props = {
  channel: SubscribedChannel;
  className?: string;
};

const SubscribeButton: FC<Props> = ({ channel, className = "" }) => {
  const dispatch = useAppDispatch();
  const isSubscribed = useAppSelector((store) =>
    store.subscriptions.channels.some(({ id }) => id === channel.id)
  );

  return (
    <button
      type="button"
      aria-pressed={isSubscribed}
      onClick={() => dispatch(toggleSubscription(channel))}
      className={`${className} flex items-center gap-[0.6rem] h-[3.6rem] px-[1.6rem] shrink-0 rounded-full text-[1.4rem] font-medium ${
        isSubscribed
          ? "bg-yt-surface hover:bg-yt-hover active:bg-yt-hover"
          : "bg-yt-text text-yt-bg hover:bg-[#d9d9d9] active:bg-[#d9d9d9]"
      }`}
    >
      {isSubscribed && <BellIcon size={20} />}
      {isSubscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;
