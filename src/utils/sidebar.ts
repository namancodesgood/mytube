import {
  ClapperboardIcon,
  DatabaseIcon,
  HomeIcon,
  MonitorPlayIcon,
  MusicIcon,
  LucideIcon,
} from "lucide-react";

type MenuItem = {
  name: string;
  shortName?: string; // label in the phone tab bar
  link: string;
  icon: LucideIcon;
};

export const SIDEBAR_MENU_ITEMS: { title: string; items: MenuItem[] }[] = [
  {
    title: "",
    items: [
      {
        name: "Home",
        link: "/",
        icon: HomeIcon,
      },
      {
        name: "Shorts",
        link: "/shorts",
        icon: ClapperboardIcon,
      },
      {
        name: "Subscriptions",
        link: "/feed/subscriptions",
        icon: MonitorPlayIcon,
      },
    ],
  },
  {
    title: "Explore",
    items: [
      {
        name: "YouTube Music",
        shortName: "Music",
        link: "/music",
        icon: MusicIcon,
      },
      {
        name: "YouTube API",
        shortName: "API",
        link: "/youtube-api",
        icon: DatabaseIcon,
      },
    ],
  },
];
