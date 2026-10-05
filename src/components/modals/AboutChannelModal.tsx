import { FC } from "react";

import Modal from "./Modal";

import { X } from "lucide-react";
import PrimaryButton from "../buttons/PrimaryButton";
import { formatTotalCount } from "@/utils/helper";

type Props = {
  description: string;
  videoCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  publishedAt: string;
  closeFn: () => void;
};

const AboutChannelModal: FC<Props> = ({
  description,
  videoCount,
  subscriberCount,
  hiddenSubscriberCount,
  publishedAt,
  closeFn,
}) => {
  return (
    <Modal>
      <div className="w-1/3 h-auto max-h-[80vh] overflow-y-auto bg-[#212121] rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl text-bold">About</h2>
          <PrimaryButton callback={closeFn} className="rounded-full p-4">
            <X />
          </PrimaryButton>
        </div>
        <p className="text-xl whitespace-pre-line break-words">{description}</p>
        <h2 className="text-3xl text-bold mt-4">Channel Details</h2>
        <ul className="text-xl">
          <li>{formatTotalCount(videoCount)}&nbsp;videos</li>
          <li>{new Date(publishedAt).toLocaleDateString()}</li>
          {!hiddenSubscriberCount && (
            <li>{formatTotalCount(subscriberCount)}&nbsp;subscribers</li>
          )}
        </ul>
      </div>
    </Modal>
  );
};

export default AboutChannelModal;
