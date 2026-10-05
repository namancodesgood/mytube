import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  currentChannelTab: number;
}

const initialState: InitialState = {
  // Wide screens start with the full guide; narrower ones open it as a drawer on demand
  isSidebarOpen: window.matchMedia("(min-width: 1280px)").matches,
  isModalOpen: true,
  currentChannelTab: 0,
};

const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    toggleSidebarState: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarState: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleModalState: (state) => {
      state.isModalOpen = !state.isModalOpen;
    },
    setCurrentChannelTab: (state, action) => {
      state.currentChannelTab = action.payload;
    },
  },
});

export const {
  toggleSidebarState,
  setSidebarState,
  toggleModalState,
  setCurrentChannelTab,
} = globalSlice.actions;

export default globalSlice.reducer;
