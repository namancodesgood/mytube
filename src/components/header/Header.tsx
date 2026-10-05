import { FC, useState } from "react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import SearchBar from "@/components/search-bar/SearchBar";
import Logo from "@/components/header/Logo";
import NotificationsMenu from "@/components/header/NotificationsMenu";

import { useAppDispatch } from "@/store/store";
import { toggleSidebarState } from "@/store/reducers/globalSlice";

import {
  ArrowLeftIcon,
  MenuIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const [isSearchOpen, setSearchOpen] = useState(false);

  const toggleSidebar = () => dispatch(toggleSidebarState());

  return (
    <header className="relative flex justify-between items-center gap-[1.6rem] box-content h-[5.6rem] pt-[env(safe-area-inset-top)] px-[1.2rem] sm:px-[1.6rem] shrink-0">
      <div className="flex items-center gap-[1.6rem]">
        <PrimaryButton
          className="rounded-full hidden md:block"
          label="Guide"
          callback={toggleSidebar}
        >
          <MenuIcon size={24} />
        </PrimaryButton>
        <Logo />
      </div>
      <SearchBar className="hidden md:block w-[min(64rem,45vw)]" />
      <div className="flex items-center gap-[0.4rem] sm:gap-[0.8rem]">
        <PrimaryButton
          className="rounded-full md:hidden"
          label="Search"
          callback={() => setSearchOpen(true)}
        >
          <SearchIcon size={24} />
        </PrimaryButton>
        <a
          href="https://studio.youtube.com"
          target="_blank"
          rel="noreferrer"
          title="Upload on YouTube Studio"
          className="hidden lg:flex items-center gap-[0.6rem] h-[3.6rem] px-[1.2rem] rounded-full bg-yt-surface hover:bg-yt-hover active:bg-yt-hover text-[1.4rem] font-medium"
        >
          <PlusIcon size={22} />
          Create
        </a>
        <NotificationsMenu />
        <span
          aria-hidden
          className="hidden sm:flex items-center justify-center w-[3.2rem] h-[3.2rem] rounded-full bg-yt-surface"
        >
          <UserIcon size={18} />
        </span>
      </div>

      {/* Phones: search takes over the header, like YouTube's app */}
      {isSearchOpen && (
        <div className="absolute inset-0 z-30 flex items-center gap-[0.8rem] pt-[env(safe-area-inset-top)] px-[0.8rem] bg-yt-bg md:hidden">
          <PrimaryButton
            className="rounded-full"
            label="Close search"
            callback={() => setSearchOpen(false)}
          >
            <ArrowLeftIcon size={24} />
          </PrimaryButton>
          <SearchBar
            autoFocus
            className="flex-1"
            onSearch={() => setSearchOpen(false)}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
