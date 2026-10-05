import { FC } from "react";

import Modal from "./Modal";

import {
  GlobeIcon,
  InfoIcon,
  MapPinIcon,
  PlaySquareIcon,
  TrendingUpIcon,
  UsersIcon,
  X,
} from "lucide-react";
import PrimaryButton from "../buttons/PrimaryButton";
import { formatTotalCount } from "@/utils/format";

type Props = {
  description: string;
  customUrl: string;
  country?: string;
  videoCount: string;
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  publishedAt: string;
  closeFn: () => void;
};

const AboutChannelModal: FC<Props> = ({
  description,
  customUrl,
  country,
  videoCount,
  viewCount,
  subscriberCount,
  hiddenSubscriberCount,
  publishedAt,
  closeFn,
}) => {
  const joined = new Date(publishedAt).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const details = [
    { icon: GlobeIcon, text: `www.youtube.com/${customUrl}` },
    ...(hiddenSubscriberCount
      ? []
      : [
          {
            icon: UsersIcon,
            text: `${formatTotalCount(subscriberCount)} subscribers`,
          },
        ]),
    {
      icon: PlaySquareIcon,
      text: `${Number(videoCount).toLocaleString()} videos`,
    },
    {
      icon: TrendingUpIcon,
      text: `${Number(viewCount).toLocaleString()} views`,
    },
    { icon: InfoIcon, text: `Joined ${joined}` },
    ...(country ? [{ icon: MapPinIcon, text: country }] : []),
  ];

  return (
    <Modal onClose={closeFn}>
      <div className="w-full max-w-[60rem] max-h-[80vh] overflow-y-auto bg-yt-menu rounded-xl p-[2.4rem] text-[1.4rem] leading-[2rem]">
        <div className="flex items-center justify-between">
          <h2 className="text-[2rem] font-bold">About</h2>
          <PrimaryButton callback={closeFn} label="Close" className="rounded-full">
            <X />
          </PrimaryButton>
        </div>
        <p className="whitespace-pre-line break-words mt-[1.2rem]">
          {description}
        </p>
        <h2 className="text-[2rem] font-bold mt-[2.4rem]">Channel details</h2>
        <ul className="flex flex-col gap-[1.6rem] mt-[1.6rem]">
          {details.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-[1.6rem]">
              <Icon size={24} className="shrink-0" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default AboutChannelModal;
