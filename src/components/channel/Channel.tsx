import { FC } from "react";

import { useQuery } from "react-query";

import { fetchChannelDetails } from "@/utils/helper";

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

  if (status === "loading") return;

  const channel = data?.items?.[0];

  if (!channel) {
    return <p className="text-2xl p-6">Couldn't load this channel.</p>;
  }

  const { brandingSettings, snippet, statistics, contentDetails } = channel;

  const { videoCount, viewCount, subscriberCount, hiddenSubscriberCount } =
    statistics;
  const { title, description, customUrl, publishedAt, thumbnails } = snippet;
  const banner = brandingSettings?.image?.bannerExternalUrl;

  return (
    <div className="w-full overflow-y-auto px-6 pb-10">
      {banner && <ChannelBanner src={banner} alt={title} />}
      <ChannelMetadata
        title={title}
        avatar={thumbnails.medium.url}
        description={description}
        customUrl={customUrl}
        publishedAt={publishedAt}
        videoCount={videoCount}
        viewCount={viewCount}
        subscriberCount={subscriberCount}
        hiddenSubscriberCount={hiddenSubscriberCount}
      />
      {/* <p className="text-2xl">{JSON.stringify(statistics)}</p> */}
      <Tabs>
        <TabSections sections={["Videos", "Playlists"]} selected={selectedTab} />
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
  );
};

export default Channel;
