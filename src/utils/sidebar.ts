import {
  ClapperboardIcon,
  DatabaseIcon,
  HomeIcon,
  MonitorPlayIcon,
  MusicIcon,
} from "lucide-react";

export const SIDEBAR_MENU_ITEMS = [
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
        link: "",
        icon: ClapperboardIcon,
      },
      {
        name: "Subscriptions",
        link: "",
        icon: MonitorPlayIcon,
      },
    ],
  },
  {
    title: "Explore",
    items: [
      {
        name: "YouTube Music",
        link: "",
        icon: MusicIcon,
      },
      {
        name: "YouTube API",
        link: "/youtube-api",
        icon: DatabaseIcon,
      },
    ],
  },
];
