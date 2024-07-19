import type { StyleProp, ViewStyle } from 'react-native';

export interface AmbientViewProps {
  colors?: string[];
  videoFrame?: string;
  isFullScreen: boolean;
  animationDelayMs: number;
  children?: React.ReactNode;
  playerItem: () => FXVideoPlayer;
}
