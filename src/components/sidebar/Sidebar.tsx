import { FC, useEffect } from "react";

import { NavLink } from "react-router-dom";

import { MenuIcon } from "lucide-react";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import Logo from "@/components/header/Logo";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSidebarState } from "@/store/reducers/globalSlice";
import { useMediaQuery } from "@/custom-hooks/useMediaQuery";
import { SIDEBAR_MENU_ITEMS } from "@/utils/sidebar";

type GuideProps = {
  full: boolean;
  onNavigate?: () => void;
};

// Full guide: icon + label rows in sections. Mini guide (72px): icon above a small label.
const Guide: FC<GuideProps> = ({ full, onNavigate }) => {
  const channels = useAppSelector((store) => store.subscriptions.channels);

  const itemClass = full
    ? "flex items-center gap-[2.4rem] h-[4rem] px-[1.2rem] rounded-[1rem] text-[1.4rem]"
    : "flex flex-col items-center gap-[0.6rem] py-[1.6rem] rounded-[1rem] text-[1rem]";
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${itemClass} ${isActive ? "bg-yt-surface font-medium" : "hover-bg"}`;

  return (
    <>
      {SIDEBAR_MENU_ITEMS.map((menuItem, idx) => (
        <section key={menuItem.title}>
          {full && idx > 0 && <hr className="my-[1.2rem] border-yt-hover" />}
          {full && menuItem.title && (
            <h3 className="px-[1.2rem] pb-[0.4rem] text-[1.6rem] font-medium">
              {menuItem.title}
            </h3>
          )}
          <ul>
            {menuItem.items.map(({ name, link, icon: Icon }) => (
              <li key={name}>
                <NavLink to={link} end onClick={onNavigate} className={linkClass}>
                  <Icon size={24} className="shrink-0" />
                  <span className="truncate max-w-full">{name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {full && channels.length > 0 && (
        <section>
          <hr className="my-[1.2rem] border-yt-hover" />
          <h3 className="px-[1.2rem] pb-[0.4rem] text-[1.6rem] font-medium">
            Subscriptions
          </h3>
          <ul>
            {channels.map(({ id, title, thumbnail }) => (
              <li key={id}>
                <NavLink
                  to={`/channel/${id}`}
                  onClick={onNavigate}
                  className={linkClass}
                >
                  <img
                    src={thumbnail}
                    alt=""
                    className="w-[2.4rem] h-[2.4rem] shrink-0 rounded-full"
                  />
                  <span className="truncate">{title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector((store) => store.globalSlice);
  const isWide = useMediaQuery("(min-width: 1280px)");
  const isDrawerOpen = isSidebarOpen && !isWide;

  const closeDrawer = () => dispatch(setSidebarState(false));

  useEffect(() => {
    if (!isDrawerOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(setSidebarState(false));
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isDrawerOpen, dispatch]);

  return (
    <>
      {/* Wide screens toggle full/mini guide; tablets keep the mini guide. Phones use BottomNav. */}
      <nav
        aria-label="Guide"
        className={`${
          isWide && isSidebarOpen ? "w-[24rem] px-[1.2rem]" : "w-[7.2rem] px-[0.4rem]"
        } shrink-0 overflow-y-auto overscroll-contain pb-[1.2rem] hidden md:block`}
      >
        <Guide full={isWide && isSidebarOpen} />
      </nav>

      {/* Below 1280px the full guide opens as a drawer over the page, like YouTube */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-40 hidden md:block">
          <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} />
          <nav
            aria-label="Guide"
            className="absolute inset-y-0 left-0 w-[24rem] overflow-y-auto overscroll-contain bg-yt-bg px-[1.2rem] pb-[1.2rem] pt-[env(safe-area-inset-top)]"
          >
            <div className="flex items-center gap-[1.6rem] h-[5.6rem] px-[0.4rem]">
              <PrimaryButton
                className="rounded-full"
                label="Close guide"
                callback={closeDrawer}
              >
                <MenuIcon size={24} />
              </PrimaryButton>
              <Logo onClick={closeDrawer} />
            </div>
            <Guide full onNavigate={closeDrawer} />
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;
