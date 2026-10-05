import { NavLink } from "react-router-dom";

import { SIDEBAR_MENU_ITEMS } from "@/utils/sidebar";

// Phones get YouTube's bottom tab bar instead of the guide
const BottomNav = () => {
  return (
    <nav
      aria-label="Primary"
      className="md:hidden shrink-0 flex border-t border-yt-border bg-yt-bg pb-[env(safe-area-inset-bottom)]"
    >
      {SIDEBAR_MENU_ITEMS.flatMap(({ items }) => items).map(
        ({ name, shortName, link, icon: Icon }) => (
          <NavLink
            key={name}
            to={link}
            end
            className={({ isActive }) =>
              `flex flex-1 min-w-0 flex-col items-center justify-center gap-[0.4rem] h-[4.8rem] text-[1rem] active:bg-yt-surface ${
                isActive ? "text-yt-text font-medium" : "text-yt-muted"
              }`
            }
          >
            <Icon size={22} />
            <span className="truncate max-w-full px-[0.2rem]">
              {shortName ?? name}
            </span>
          </NavLink>
        )
      )}
    </nav>
  );
};

export default BottomNav;
