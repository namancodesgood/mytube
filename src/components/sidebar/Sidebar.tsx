import { Link } from "react-router-dom";

import { useAppSelector } from "@/store/store";
import { SIDEBAR_MENU_ITEMS } from "@/utils/sidebar";

const Sidebar = () => {
  const { isSidebarOpen } = useAppSelector((store) => store.globalSlice);

  const sidebarWidth = isSidebarOpen ? "w-[24rem]" : "w-24";

  return (
    <div
      className={`ease-linear ${sidebarWidth} shrink-0 transition-all duration-150 overflow-auto hidden md:block`}
    >
      {SIDEBAR_MENU_ITEMS.map((menuItem, idx) => (
        <ul key={menuItem.title}>
          {idx > 0 && <hr className="my-2" />}
          {isSidebarOpen && <p className="font-bold ml-2">{menuItem.title}</p>}
          {menuItem.items.map((subItem) => {
            const itemClass = "flex items-center gap-6 px-4 py-2";
            const label = (
              <>
                {subItem.icon && (
                  <subItem.icon size={26} className="overflow-visible" />
                )}
                <span className={`truncate overflow-clip text-xl`}>
                  {subItem.name}
                </span>
              </>
            );

            return (
              <li
                key={subItem.name}
                className={`m-2 hover-bg cursor-pointer rounded-xl text-sm`}
              >
                {/* Items without a page yet stay plain text */}
                {subItem.link ? (
                  <Link to={subItem.link} className={itemClass}>
                    {label}
                  </Link>
                ) : (
                  <span className={itemClass}>{label}</span>
                )}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
};

export default Sidebar;
