import React from 'react';
import { ResizeMode, Video } from 'expo-av';
import { captureRef } from 'react-native-view-shot';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Pressable, StyleSheet, BackHandler } from 'react-native';

import Controls from './Controls';
import { useVideoPlayer } from '../hooks';
import { VideoPlayerContext } from '../context';

type VideoPlayerProps = {
  sources: string[];
  autoPlay?: boolean;
  isLooping?: boolean;
  videoFrameInterval?: number;
  videoFrame?: (url: string) => void;
  onFullScreenUpdate?: (isFullScreen: boolean) => void;
};

const FXVideoPlayer: React.FC<VideoPlayerProps> = ({
  autoPlay = true,
  isLooping = true,
  ...props
}) => {
  const video = React.useRef<Video>(null);
  const player = useVideoPlayer(props.sources, video);

  const [fullScreen, setFullScreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const action = () => {
      if (fullScreen) handleFullscreenUpdate();
      return fullScreen;
    };
    const handler = BackHandler.addEventListener('hardwareBackPress', action);
    return () => handler.remove();
  }, [fullScreen]);

  React.useEffect(() => {
    if (props.videoFrameInterval && props.videoFrameInterval > 0) {
      const interval = setInterval(async () => {
        const uri = await captureRef(video, { format: 'jpg' });
        props.videoFrame && props.videoFrame(uri);
      }, props.videoFrameInterval);
      return () => clearInterval(interval);
    }
    return () => {};
  }, []);

  const handleFullscreenUpdate = async () => {
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
    <VideoPlayerContext.Provider value={{ ...player }}>
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
          onError={(error) => player.setError(error)}
          onPlaybackStatusUpdate={player.handlePlaybackStatusUpdate}
          onFullscreenUpdate={handleFullscreenUpdate}
          style={styles.video}
        />
        <Controls
          videoRef={video}
          isLive={player.isLive}
          handleToggleMute={player.toggleMute}
          handleReload={player.handleVideoReload}
          handleNextTrack={player.handleNextTrack}
          handleTogglePlay={player.togglePlayback}
          handleFullScreen={handleFullscreenUpdate}
          onValueChange={player.resetControlsTimeout}
          handleSlidingStart={player.handleSlidingStart}
          handlePreviousTrack={player.handlePreviousTrack}
          handleSlidingComplete={player.handleSlidingComplete}
        />
      </Pressable>
    </VideoPlayerContext.Provider>
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
