import { create } from "zustand";

export const useFullScreenStore = create<{ fullScreen: boolean }>((_) => ({
  fullScreen: false,
}));
