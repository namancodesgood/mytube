import { FC } from "react";

import { Link } from "react-router-dom";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import SearchBar from "@/components/search-bar/SearchBar";

import { BRAND_NAME } from "@/utils/constants";

import { useAppDispatch } from "@/store/store";
import { toggleSidebarState } from "@/store/reducers/globalSlice";

import { BellIcon, MenuIcon, PlusIcon, UserIcon } from "lucide-react";

const Header: FC = () => {
  const dispatch = useAppDispatch();

  const toggleSidebar = () => dispatch(toggleSidebarState());

  return (
    <header className="flex justify-between items-center gap-[1.6rem] h-[5.6rem] px-[1.6rem] shrink-0">
      <div className="flex items-center gap-[1.6rem]">
        <PrimaryButton
          className="rounded-full hidden md:block"
          label="Guide"
          callback={toggleSidebar}
        >
          <MenuIcon size={24} />
        </PrimaryButton>
        <Link to="/" className="flex items-center gap-[0.4rem]">
          <span className="flex items-center justify-center w-[2.9rem] h-[2rem] rounded-[0.6rem] bg-[#ff0033]">
            <span className="w-0 h-0 ml-[0.2rem] border-y-[0.5rem] border-y-transparent border-l-[0.8rem] border-l-white" />
          </span>
          <span className="text-[2rem] font-bold tracking-tighter">
            {BRAND_NAME}
          </span>
        </Link>
      </div>
      <SearchBar className="hidden md:block" />
      <div className="flex items-center gap-[0.8rem]">
        <button
          type="button"
          title="Coming soon"
          className="hidden lg:flex items-center gap-[0.6rem] h-[3.6rem] px-[1.2rem] rounded-full bg-yt-surface hover:bg-yt-hover text-[1.4rem] font-medium"
        >
          <PlusIcon size={22} />
          Create
        </button>
        <button
          type="button"
          title="Coming soon"
          aria-label="Notifications"
          className="p-[0.8rem] rounded-full hover-bg"
        >
          <BellIcon size={24} />
        </button>
        <span
          aria-hidden
          className="flex items-center justify-center w-[3.2rem] h-[3.2rem] rounded-full bg-yt-surface"
        >
          <UserIcon size={18} />
        </span>
      </div>
    </header>
  );
};

export default Header;
