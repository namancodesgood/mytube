import { setCurrentChannelTab } from "@/store/reducers/globalSlice";
import { useAppDispatch } from "@/store/store";
import { FC } from "react";

type Props = {
  sections: string[];
  selected: number;
};

const TabSections: FC<Props> = ({ sections, selected }) => {
  const dispatch = useAppDispatch();
  const handleTabChange = (idx: number) => {
    dispatch(setCurrentChannelTab(idx));
  };

  return (
    <div
      role="tablist"
      className="flex gap-[2.4rem] border-b border-yt-hover mt-[1.6rem]"
    >
      {sections.map((sectionTitle, idx) => (
        <button
          key={sectionTitle}
          role="tab"
          aria-selected={idx === selected}
          onClick={() => handleTabChange(idx)}
          className={`h-[4.8rem] -mb-px border-b-2 text-[1.6rem] font-medium ${
            idx === selected
              ? "border-yt-text text-yt-text"
              : "border-transparent text-yt-muted hover:border-yt-muted"
          }`}
        >
          {sectionTitle}
        </button>
      ))}
    </div>
  );
};

export default TabSections;
