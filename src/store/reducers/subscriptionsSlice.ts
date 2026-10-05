import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ChannelItem } from "@/interfaces/ChannelData";

// Subscriptions live in this browser: YouTube's own list needs a Google sign-in (OAuth)
export type SubscribedChannel = {
  id: string;
  title: string;
  thumbnail: string;
  uploads: string; // uploads playlist, read by the subscriptions feed
};

const STORAGE_KEY = "mytube.subscriptions";

const loadSubscriptions = (): SubscribedChannel[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return []; // storage blocked (private mode) or corrupt: start empty
  }
};

export const saveSubscriptions = (channels: SubscribedChannel[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
  } catch {
    // storage blocked: subscriptions last for this visit only
  }
};

export const toSubscribedChannel = (channel: ChannelItem): SubscribedChannel => ({
  id: channel.id,
  title: channel.snippet.title,
  thumbnail: channel.snippet.thumbnails.default.url,
  uploads: channel.contentDetails.relatedPlaylists.uploads,
});

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: { channels: loadSubscriptions() },
  reducers: {
    toggleSubscription: (state, action: PayloadAction<SubscribedChannel>) => {
      const index = state.channels.findIndex(({ id }) => id === action.payload.id);
      if (index === -1) state.channels.unshift(action.payload);
      else state.channels.splice(index, 1);
    },
  },
});

export const { toggleSubscription } = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
