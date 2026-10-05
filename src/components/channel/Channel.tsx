import { FC } from "react";

import { useQuery } from "react-query";

import { fetchChannelDetails } from "@/utils/helper";
import { toSubscribedChannel } from "@/store/reducers/subscriptionsSlice";

import ChannelBanner from "@/components/channel/ChannelBanner";
import ChannelMetadata from "@/components/channel/ChannelMetadata";
import ChannelVideos from "@/components/channel/ChannelVideos";
import ChannelPlaylists from "@/components/channel/ChannelPlaylists";
import Tabs from "@/components/tabs/Tabs";
import TabSections from "../tabs/TabSections";
import TabContent from "../tabs/TabContent";
import { useAppSelector } from "@/store/store";

type Props = {
  channelId: string | string;
};

const Channel: FC<Props> = ({ channelId }) => {
  const { data, status } = useQuery(["channelDetails", channelId], () =>
    fetchChannelDetails(channelId)
  );
  const selectedTab = useAppSelector(
    (store) => store.globalSlice.currentChannelTab
  );

  if (status === "loading") {
    return (
      <div className="w-full max-w-[128.4rem] mx-auto px-[1.6rem] sm:px-[2.4rem] pt-[1.6rem]">
        <div className="w-full aspect-[6.2/1] rounded-xl shimmer" />
        <div className="flex items-center gap-[1.6rem] mt-[1.6rem]">
          <div className="w-[7.2rem] h-[7.2rem] sm:w-[16rem] sm:h-[16rem] shrink-0 rounded-full shimmer" />
          <div className="flex flex-col gap-[1.2rem] w-full">
            <div className="h-[3.6rem] w-[50%] sm:w-[30%] rounded shimmer" />
            <div className="h-[1.4rem] w-[70%] sm:w-[40%] rounded shimmer" />
            <div className="h-[3.6rem] w-[10rem] rounded-full shimmer" />
          </div>
        </div>
      </div>
    );
  }

  const channel = data?.items?.[0];

  if (!channel) {
    return <p className="p-[2.4rem] text-[1.4rem]">Couldn't load this channel.</p>;
  }

  const { brandingSettings, snippet, statistics, contentDetails } = channel;

  const { videoCount, viewCount, subscriberCount, hiddenSubscriberCount } =
    statistics;
  const { title, description, customUrl, publishedAt, thumbnails, country } =
    snippet;
  const banner = brandingSettings?.image?.bannerExternalUrl;

  return (
    <div className="w-full overflow-y-auto">
      <div className="max-w-[128.4rem] mx-auto px-[1.6rem] sm:px-[2.4rem] pt-[1.6rem] pb-10">
        {banner && <ChannelBanner src={banner} alt="" />}
        <ChannelMetadata
          title={title}
          avatar={thumbnails.medium.url}
          description={description}
          customUrl={customUrl}
          publishedAt={publishedAt}
          country={country}
          videoCount={videoCount}
          viewCount={viewCount}
          subscriberCount={subscriberCount}
          hiddenSubscriberCount={hiddenSubscriberCount}
          subscription={toSubscribedChannel(channel)}
        />
        <Tabs>
          <TabSections
            sections={["Videos", "Playlists"]}
            selected={selectedTab}
          />
          <TabContent
            content={[
              <ChannelVideos
                uploadsPlaylistId={contentDetails.relatedPlaylists.uploads}
              />,
              <ChannelPlaylists channelId={channelId} />,
            ]}
            selected={selectedTab}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default Channel;
