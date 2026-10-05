import { FC } from "react";

import { Link } from "react-router-dom";

import { BRAND_NAME } from "@/utils/constants";

type Props = {
  onClick?: () => void;
};

const Logo: FC<Props> = ({ onClick }) => {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-[0.4rem]">
      <span className="flex items-center justify-center w-[2.9rem] h-[2rem] rounded-[0.6rem] bg-[#ff0033]">
        <span className="w-0 h-0 ml-[0.2rem] border-y-[0.5rem] border-y-transparent border-l-[0.8rem] border-l-white" />
      </span>
      <span className="text-[2rem] font-bold tracking-tighter whitespace-nowrap">
        {BRAND_NAME}
      </span>
    </Link>
  );
};

export default Logo;
