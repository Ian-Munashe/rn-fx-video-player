export interface VideoPlayerProps {
  sources: string[];
  autoPlay?: boolean;
  isLooping?: boolean;
  videoFrameInterval?: number;
  onVideoFrame?: (url: string) => void;
  onFullScreenUpdate?: (isFullScreen: boolean) => void;
}

export default function FXVideoPlayer(
  props: VideoPlayerProps
): React.ReactElement;
