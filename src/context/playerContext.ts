import { createContext } from "react";
import { Animated } from "react-native";
import type { AVPlaybackStatusSuccess } from "expo-av";

export type PlayerState = {
  isMuted: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  showControls: boolean;
  error: string | null;
  controlsAnimation: Animated.Value;
  playback: AVPlaybackStatusSuccess;
};

export const PlayerContext = createContext<PlayerState | undefined>(undefined);
