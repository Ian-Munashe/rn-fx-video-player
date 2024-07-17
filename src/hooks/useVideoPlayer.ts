import React from 'react';
import { Animated } from 'react-native';
import type { AVPlaybackStatus, AVPlaybackStatusSuccess, Video } from 'expo-av';

export const useVideoPlayer = (
  sources: string[],
  Video: React.RefObject<Video>
) => {
  const timer = 5000;
  const timeoutRef = React.useRef<any>(null);
  const controlsAnimation = React.useRef(new Animated.Value(1)).current;

  const [isMuted, setMuted] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showControls, setShowControls] = React.useState<boolean>(false);

  const [error, setError] = React.useState<string | null>(null);
  const [source, setSource] = React.useState<string | any>(sources[0]);
  const [playback, setPlayback] = React.useState<AVPlaybackStatusSuccess>();

  React.useEffect(() => {
    if (showControls) showControlsAnimation();
    timeoutRef.current = setTimeout(hideControlsAnimation, timer);
    return () => clearTimeout(timeoutRef.current);
  }, [showControls]);

  const resetControlsTimeout = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(hideControlsAnimation, timer);
  };

  const showControlsAnimation = () => {
    Animated.timing(controlsAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideControlsAnimation = () => {
    Animated.timing(controlsAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowControls(false));
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
    if (!Video.current) return setError('video reference is null');
    try {
      const status = await Video.current.getStatusAsync();
      Video.current.setStatusAsync(status);
      Video.current.playAsync();
      setIsLoading(true);
      setError(null);
    } catch (error: any) {
      setError(error.message);
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
      setIsLoading(!playbackStatus.isPlaying);
      if (playbackStatus.didJustFinish) handleNextTrack();
    }
  };

  return {
    isMuted,
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
  };
};
