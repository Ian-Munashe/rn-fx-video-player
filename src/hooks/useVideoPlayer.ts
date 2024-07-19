import React from "react";
import { Animated } from "react-native";
import type { AVPlaybackStatus, AVPlaybackStatusSuccess, Video } from "expo-av";

export const useVideoPlayer = (
  sources: string[],
  Video: React.RefObject<Video>
) => {
  const timer = 5000;
  const timeoutRef = React.useRef<any>(null);
  const showControlsRef = React.useRef<any>(null);
  const hideControlsRef = React.useRef<any>(null);
  const controlsAnimation = React.useRef(new Animated.Value(1)).current;

  const [isLive, setIsLive] = React.useState<boolean>(false);
  const [isMuted, setMuted] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [showControls, setShowControls] = React.useState<boolean>(false);

  const [error, setError] = React.useState<string>("");
  const [source, setSource] = React.useState<string | any>(sources[0]);
  const [playback, setPlayback] = React.useState<AVPlaybackStatusSuccess>();

  React.useEffect(
    () => setIsLive(source.startsWith("rtmp://") || source.includes(".m3u8")),
    [source]
  );

  React.useEffect(() => {
    showControlsRef.current = () =>
      Animated.timing(controlsAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

    hideControlsRef.current = () =>
      Animated.timing(controlsAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowControls(false));

    if (showControls) showControlsRef.current();
    timeoutRef.current = setTimeout(hideControlsRef.current, timer);
    return () => clearTimeout(timeoutRef.current);
  }, [showControls, controlsAnimation]);

  const resetControlsTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(hideControlsRef.current, timer);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    isPlaying ? Video.current?.pauseAsync() : Video.current?.playAsync();
    resetControlsTimeout();
  };

  const toggleMute = () => {
    setMuted(!isMuted);
    Video.current?.setIsMutedAsync(isMuted);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setShowControls(true);
    setIsPlaying(true);
  };

  const handleVideoReload = async () => {
    if (!Video.current) return setError("video reference is null");
    try {
      const status: any = await Video.current.getStatusAsync();
      setIsLoading(true);
      setError("");
      await Video.current.unloadAsync();
      await Video.current.loadAsync({ uri: source });
      await Video.current.playFromPositionAsync(status.positionMillis ?? 0);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSlidingStart = () => setIsPlaying(false);

  const handleSlidingComplete = async (
    currentSeconds: number,
    duration: number
  ) => {
    const targetSeconds = currentSeconds * duration;
    await Video.current?.setPositionAsync(targetSeconds);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    const currentTrackIndex = sources.indexOf(source);
    const nextTrackIndex = (currentTrackIndex + 1) % sources.length;
    setSource(sources[nextTrackIndex]);
    resetControlsTimeout();
  };

  const handlePreviousTrack = () => {
    const currentSourceIndex = sources.indexOf(source);
    const previousSourceIndex =
      (currentSourceIndex - 1 + sources.length) % sources.length;
    setSource(sources[previousSourceIndex]);
    resetControlsTimeout();
  };

  const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      setPlayback(playbackStatus);
      setIsLoading(!playbackStatus.shouldPlay && playbackStatus.isPlaying);
      if (playbackStatus.didJustFinish) handleNextTrack();
      setIsLoading(!playbackStatus.isPlaying && playbackStatus.shouldPlay);
      return;
    }
    setError(
      "The video could not be loaded. Please check your internet connection and try reloading the player. You can also try again later."
    );
  };

  return {
    isMuted,
    isLive,
    source,
    playback: playback!,
    isPlaying,
    showControls,
    isLoading,
    error,
    controlsAnimation,
    setError,
    toggleMute,
    setMuted,
    setIsLoading,
    setShowControls,
    togglePlayback,
    handleVideoLoad,
    handleVideoReload,
    handleSlidingStart,
    handleSlidingComplete,
    handleNextTrack,
    handlePreviousTrack,
    handlePlaybackStatusUpdate,
    resetControlsTimeout,
  };
};
