import Hello from "@/pages/Hello";
import ChannelDetailsPage from "@/pages/ChannelDetailsPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import VideoDetailsPage from "@/pages/VideoDetailsPage";
import YouTubeApiPage from "@/pages/YouTubeApiPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import PlaylistPage from "@/pages/PlaylistPage";
import ShortsPage from "@/pages/ShortsPage";
import SubscriptionsPage from "@/pages/SubscriptionsPage";
import Home from "@/components/Home";

import { RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/channel/:channelId",
        element: <ChannelDetailsPage />,
      },
      {
        path: "/watch/:videoId",
        element: <VideoDetailsPage />,
      },
      {
        path: "/results",
        element: <SearchResultsPage />,
      },
      {
        path: "/playlist",
        element: <PlaylistPage />,
      },
      {
        path: "/shorts",
        element: <ShortsPage />,
      },
      {
        path: "/feed/subscriptions",
        element: <SubscriptionsPage />,
      },
      {
        path: "/music",
        element: <Home categoryId="10" title="Music" />,
      },
      {
        path: "/youtube-api",
        element: <YouTubeApiPage />,
      },
      {
        path: "test",
        element: <Hello />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />, // Replace with the actual component for 404
  },
];

export default routes;
