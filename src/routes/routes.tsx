import Hello from "@/pages/Hello";
import ChannelDetailsPage from "@/pages/ChannelDetailsPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import VideoDetailsPage from "@/pages/VideoDetailsPage";
import YouTubeApiPage from "@/pages/YouTubeApiPage";

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
