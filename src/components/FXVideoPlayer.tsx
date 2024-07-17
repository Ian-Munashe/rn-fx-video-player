import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { captureRef } from 'react-native-view-shot';

import Controls from './Controls';
import { VideoPlayerContext } from '../context';
import { useVideoPlayer } from '../hooks';

import * as ScreenOrientation from 'expo-screen-orientation';

type VideoPlayerProps = {
  sources: string[];
  isLooping?: boolean;
  videoFrameInterval?: number;
  videoFrame?: (url: string) => void;
  onFullScreenUpdate?: (isFullScreen: boolean) => void;
};

const FXVideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const video = React.useRef<Video>(null);
  const player = useVideoPlayer(props.sources, video);

  const [isLive, setIsLive] = React.useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false);

  React.useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    setIsLive(
      player.source.startsWith('rtmp://') || player.source.includes('.m3u8')
    );
  }, []);

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

  return (
    <VideoPlayerContext.Provider value={{ ...player }}>
      <Pressable
        style={styles.container}
        onPress={() => player.playback && player.setShowControls(true)}
      >
        <Video
          ref={video}
          shouldPlay
          isMuted={player.isMuted}
          source={{ uri: player.source }}
          resizeMode={ResizeMode.CONTAIN}
          onLoad={player.handleVideoLoad}
          isLooping={props.isLooping ?? true}
          onLoadStart={() => player.setIsLoading(true)}
          onError={() => player.setError('An error occured.')}
          onPlaybackStatusUpdate={player.handlePlaybackStatusUpdate}
          style={styles.video}
        />
        <Controls
          isLive={isLive}
          videoRef={video}
          handleNextTrack={player.handleNextTrack}
          handlePreviousTrack={player.handlePreviousTrack}
          handleTogglePlay={player.togglePlayback}
          handleReload={player.handleVideoReload}
          handleSlidingStart={player.handleSlidingStart}
          handleToggleMute={player.toggleMute}
          handleSlidingComplete={player.handleSlidingComplete}
          handleFullScreen={async () => {
            await ScreenOrientation.lockAsync(
              isFullScreen
                ? ScreenOrientation.OrientationLock.PORTRAIT
                : ScreenOrientation.OrientationLock.LANDSCAPE
            );
            setIsFullScreen(true);
            props.onFullScreenUpdate && props.onFullScreenUpdate(!isFullScreen);
          }}
        />
      </Pressable>
    </VideoPlayerContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative' },
  video: {
    backgroundColor: 'black',
    aspectRatio: 16 / 9,
  },
});

export default FXVideoPlayer;
