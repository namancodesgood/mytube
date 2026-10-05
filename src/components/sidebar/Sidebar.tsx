import { NavLink } from "react-router-dom";

import { useAppSelector } from "@/store/store";
import { SIDEBAR_MENU_ITEMS } from "@/utils/sidebar";

const Sidebar = () => {
  const { isSidebarOpen } = useAppSelector((store) => store.globalSlice);

  // Full guide (240px) vs YouTube's mini guide (72px, icon above label)
  const itemClass = isSidebarOpen
    ? "flex items-center gap-[2.4rem] h-[4rem] px-[1.2rem] rounded-[1rem] text-[1.4rem]"
    : "flex flex-col items-center gap-[0.6rem] py-[1.6rem] rounded-[1rem] text-[1rem]";

  return (
    <nav
      className={`${
        isSidebarOpen ? "w-[24rem] px-[1.2rem]" : "w-[7.2rem] px-[0.4rem]"
      } shrink-0 overflow-y-auto pb-[1.2rem] hidden md:block`}
    >
      {SIDEBAR_MENU_ITEMS.map((menuItem, idx) => (
        <ul key={menuItem.title}>
          {isSidebarOpen && idx > 0 && (
            <hr className="my-[1.2rem] border-yt-hover" />
          )}
          {isSidebarOpen && menuItem.title && (
            <h3 className="px-[1.2rem] pb-[0.4rem] text-[1.6rem] font-medium">
              {menuItem.title}
            </h3>
          )}
          {menuItem.items.map((subItem) => {
            const label = (
              <>
                <subItem.icon size={24} className="shrink-0" />
                <span className="truncate max-w-full">{subItem.name}</span>
              </>
            );

            return (
              <li key={subItem.name}>
                {/* Items without a page yet stay plain text */}
                {subItem.link ? (
                  <NavLink
                    to={subItem.link}
                    end
                    className={({ isActive }) =>
                      `${itemClass} ${
                        isActive ? "bg-yt-surface font-medium" : "hover-bg"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ) : (
                  <span className={`${itemClass} hover-bg cursor-pointer`}>
                    {label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      ))}
    </nav>
  );
};

export default Sidebar;
