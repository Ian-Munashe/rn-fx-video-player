import React from "react";
import type { Video } from "expo-av";
import { BackHandler } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as ScreenOrientation from "expo-screen-orientation";

type FullScreenProps = {
  frameInterval: number;
  resetControlsTimeout: () => void;
  onVideoFrame?: (url: string) => void;
  onFullScreenUpdate?: (isFullScreen: boolean) => void;
};

export const useFullScreen = (
  video: React.RefObject<Video>,
  {
    frameInterval,
    resetControlsTimeout,
    onVideoFrame,
    onFullScreenUpdate,
  }: FullScreenProps
) => {
  const toggleFullscreenRef = React.useRef<any>(null);
  const onFullScreenUpdateRef = React.useRef<any>(onFullScreenUpdate);
  const resetControlsTimeoutRef = React.useRef<any>(resetControlsTimeout);

  const [fullScreen, setFullScreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (frameInterval && frameInterval > 0) {
      const interval = setInterval(async (): Promise<void> => {
        const uri = await captureRef(video, { format: "jpg" });
        onVideoFrame && onVideoFrame(uri);
      }, frameInterval);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [frameInterval, onVideoFrame, video]);

  React.useEffect(() => {
    const toggleFullscreen = async (): Promise<void> => {
      const orientationLock = fullScreen
        ? ScreenOrientation.OrientationLock.PORTRAIT
        : ScreenOrientation.OrientationLock.LANDSCAPE;
      await ScreenOrientation.lockAsync(orientationLock);
      setFullScreen(!fullScreen);
      onFullScreenUpdateRef.current(!fullScreen);
      resetControlsTimeoutRef.current();
    };
    toggleFullscreenRef.current = toggleFullscreen;
    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      (): boolean => {
        if (fullScreen) toggleFullscreenRef.current();
        return fullScreen;
      }
    );
    return () => handler.remove();
  }, [fullScreen]);

  return { fullScreen, toggleFullscreenRef };
};
