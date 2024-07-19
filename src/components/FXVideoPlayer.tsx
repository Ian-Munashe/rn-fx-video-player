import React from "react";
import { ResizeMode, Video } from "expo-av";
import { Pressable, StyleSheet } from "react-native";

import Controls from "./Controls";
import { useFullScreen, useVideoPlayer } from "../hooks";
import { PlayerContext } from "../context";
import type { VideoPlayerProps } from "../types";

/**
 * Renders a video player component with fullscreen support.
 *
 * @param {boolean} [autoPlay=true] - Whether the video should automatically play on load.
 * @param {boolean} [isLooping=true] - Whether the video should loop playback.
 * @param {(string | string[])} sources - Array of video sources.
 * @param {(string | undefined)} [onVideoFrame] - The callback for when a video frame is captured. This function return the captured frame url
 * @param {(boolean | undefined)} [onFullScreenUpdate] - The callback for when the video player is in fullscreen or not.
 */
const FXVideoPlayer: React.FC<VideoPlayerProps> = ({
  autoPlay = true,
  isLooping = true,
  ...props
}: VideoPlayerProps): React.ReactElement => {
  const video = React.useRef<Video>(null);
  const player = useVideoPlayer(props.sources, video);
  const { fullScreen, toggleFullscreenRef } = useFullScreen(video, {
    frameInterval: props.videoFrameInterval ?? 0,
    onVideoFrame: props.onVideoFrame,
    onFullScreenUpdate: props.onFullScreenUpdate,
    resetControlsTimeout: player.resetControlsTimeout,
  });

  return (
    <PlayerContext.Provider value={{ ...player }}>
      <Pressable
        style={[styles.container, fullScreen ? styles.height : styles.width]}
        onPress={() => player.playback && player.setShowControls(true)}
      >
        <Video
          ref={video}
          isLooping={isLooping}
          isMuted={player.isMuted}
          shouldPlay={autoPlay}
          source={{ uri: player.source }}
          resizeMode={ResizeMode.CONTAIN}
          onLoad={player.handleVideoLoad}
          onLoadStart={() => player.setIsLoading(true)}
          onError={(error): void => player.setError(error)}
          onPlaybackStatusUpdate={player.handlePlaybackStatusUpdate}
          style={styles.video}
        />
        <Controls
          videoRef={video}
          isLive={player.isLive}
          handleToggleMute={player.toggleMute}
          handleReload={player.handleVideoReload}
          handleNextTrack={player.handleNextTrack}
          handleTogglePlay={player.togglePlayback}
          onValueChange={player.resetControlsTimeout}
          handleFullScreen={toggleFullscreenRef.current}
          handleSlidingStart={player.handleSlidingStart}
          handlePreviousTrack={player.handlePreviousTrack}
          handleSlidingComplete={player.handleSlidingComplete}
        />
      </Pressable>
    </PlayerContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    aspectRatio: 16 / 9,
  },
  video: {
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
  height: { height: "100%" },
  width: { width: "100%" },
});

export default FXVideoPlayer;
