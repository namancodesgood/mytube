import { FC } from "react";

import { getFormattedDuration } from "@/utils/format";

type Props = {
  duration: string;
};

const VideoCardDuration: FC<Props> = ({ duration }: Props) => {
  const length = getFormattedDuration(duration);

  if (!length) return null;

  return (
    <span className="absolute right-[0.8rem] bottom-[0.8rem] bg-black/80 px-[0.4rem] py-[0.1rem] rounded-[0.4rem] text-[1.2rem] font-medium">
      {length}
    </span>
  );
};

export default VideoCardDuration;
