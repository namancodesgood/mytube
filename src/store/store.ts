import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";

import globalSlice from "@/store/reducers/globalSlice";
import subscriptionsSlice, {
  saveSubscriptions,
} from "@/store/reducers/subscriptionsSlice";

export const store = configureStore({
  reducer: {
    globalSlice: globalSlice,
    subscriptions: subscriptionsSlice,
  },
});

// Persist subscriptions whenever they change
let savedChannels = store.getState().subscriptions.channels;
store.subscribe(() => {
  const { channels } = store.getState().subscriptions;
  if (channels === savedChannels) return;
  savedChannels = channels;
  saveSubscriptions(channels);
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
