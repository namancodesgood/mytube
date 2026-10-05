import { FC, ReactNode } from "react";

type Props = {
  content: ReactNode[];
  selected: number;
};

const TabContent: FC<Props> = ({ content, selected }) => {
  return (
    <div className="mt-6">
      {content.map(
        (el, idx) => idx === selected && <span key={idx}>{el}</span>
      )}
    </div>
  );
};

export default TabContent;
