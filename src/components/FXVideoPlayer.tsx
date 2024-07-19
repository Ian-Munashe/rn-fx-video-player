import React from 'react';
import { ResizeMode, Video } from 'expo-av';
import { captureRef } from 'react-native-view-shot';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Pressable, StyleSheet, BackHandler } from 'react-native';

import Controls from './Controls';
import { useVideoPlayer } from '../hooks';
import { PlayerContext } from '../context';
import type { VideoPlayerProps } from '../types';

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

  const [fullScreen, setFullScreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const action = (): boolean => {
      if (fullScreen) toggleFullscreen();
      return fullScreen;
    };
    const handler = BackHandler.addEventListener('hardwareBackPress', action);
    return () => handler.remove();
  }, [fullScreen]);

  React.useEffect(() => {
    if (props.videoFrameInterval && props.videoFrameInterval > 0) {
      const interval = setInterval(async (): Promise<void> => {
        const uri = await captureRef(video, { format: 'jpg' });
        props.onVideoFrame && props.onVideoFrame(uri);
      }, props.videoFrameInterval);
      return () => clearInterval(interval);
    }
    return () => {};
  }, []);

  const toggleFullscreen = async (): Promise<void> => {
    await ScreenOrientation.lockAsync(
      fullScreen
        ? ScreenOrientation.OrientationLock.PORTRAIT
        : ScreenOrientation.OrientationLock.LANDSCAPE
    );
    setFullScreen(!fullScreen);
    props.onFullScreenUpdate && props.onFullScreenUpdate(!fullScreen);
    player.resetControlsTimeout();
  };

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
          onFullscreenUpdate={toggleFullscreen}
          style={styles.video}
        />
        <Controls
          videoRef={video}
          isLive={player.isLive}
          handleToggleMute={player.toggleMute}
          handleReload={player.handleVideoReload}
          handleNextTrack={player.handleNextTrack}
          handleTogglePlay={player.togglePlayback}
          handleFullScreen={toggleFullscreen}
          onValueChange={player.resetControlsTimeout}
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
    position: 'relative',
    aspectRatio: 16 / 9,
  },
  video: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  height: { height: '100%' },
  width: { width: '100%' },
});

export default FXVideoPlayer;
