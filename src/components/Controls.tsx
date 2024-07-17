import {
  View,
  Text,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';

import Utils from '../utils';
import IconButton from './IconButton';
import ErrorComponent from './ErrorComponent';
import { useVideoPlayerContext } from '../hooks/useVideoPlayerContext';

type PlayerControlsProps = {
  isLive: boolean;
  videoRef: React.MutableRefObject<any>;
  handleNextTrack: () => void;
  handleReload: () => void;
  onValueChange: () => void;
  handleToggleMute: () => void;
  handleTogglePlay: () => void;
  handleFullScreen: () => void;
  handlePreviousTrack: () => void;
  handleSlidingStart: () => void;
  handleSlidingComplete: (e: number, duration: number) => void;
};

const Controls: React.FC<PlayerControlsProps> = (props) => {
  const {
    isLoading,
    playback,
    isPlaying,
    isMuted,
    showControls,
    error,
    controlsAnimation,
  } = useVideoPlayerContext();

  return (
    <View style={styles.container}>
      {isLoading && !error && (
        <ActivityIndicator color="white" size="large" style={{ zIndex: 50 }} />
      )}
      <ErrorComponent onReload={props.handleReload} />
      {!error && (
        <Animated.View
          style={[styles.container, { opacity: controlsAnimation }]}
        >
          {showControls && (
            <LinearGradient
              style={{ height: '100%', width: '100%' }}
              colors={[
                'transparent',
                'rgba(0, 0, 0, 0.2)',
                'rgba(0, 0, 0, 0.8)',
              ]}
            >
              <View style={styles.controlsContainer}>
                {!props.isLive && (
                  <Slider
                    value={playback.positionMillis / playback.durationMillis!}
                    minimumValue={0}
                    maximumValue={1}
                    thumbTintColor={'white'}
                    minimumTrackTintColor="white"
                    maximumTrackTintColor={'white'}
                    onSlidingStart={props.handleSlidingStart}
                    onValueChange={props.onValueChange}
                    onSlidingComplete={async (e) =>
                      props.handleSlidingComplete(
                        e,
                        playback.durationMillis ?? 0
                      )
                    }
                  />
                )}
                <View style={styles.timerControlsContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {renderLeftControls(props, isPlaying, isMuted)}
                    {props.isLive ? (
                      <Text style={[styles.text, { fontWeight: 'bold' }]}>
                        LIVE
                      </Text>
                    ) : (
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text style={styles.text}>
                          {Utils.formatTime(playback.positionMillis)}
                        </Text>
                        <Text style={[styles.text, { marginHorizontal: 4 }]}>
                          /
                        </Text>
                        <Text style={styles.text}>
                          {Utils.formatTime(playback.durationMillis)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {renderRightControls(props.handleFullScreen)}
                </View>
              </View>
            </LinearGradient>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const renderRightControls = (handleFullScreen: () => void) => {
  return (
    <View style={styles.rightControlsContainer}>
      <IconButton
        name="screen-full"
        type={Octicons}
        onPress={handleFullScreen}
      />
    </View>
  );
};

const renderLeftControls = (
  props: PlayerControlsProps,
  isPlaying: boolean,
  isMuted: boolean
) => {
  const {
    handlePreviousTrack,
    handleTogglePlay,
    handleNextTrack,
    handleToggleMute,
  } = props;
  const playButtonName = isPlaying ? 'pause-outline' : 'play-outline';
  const volumeButtonName = isMuted
    ? 'volume-mute-outline'
    : 'volume-high-outline';

  return (
    <View style={styles.leftControlsContainer}>
      {!props.isLive && (
        <IconButton
          name="skip-previous"
          type={MaterialIcons}
          onPress={handlePreviousTrack}
          size={20}
        />
      )}
      <IconButton
        styles={{ marginHorizontal: props.isLive ? 0 : 4 }}
        name={playButtonName}
        type={Ionicons}
        onPress={handleTogglePlay}
      />
      {!props.isLive && (
        <IconButton
          name="skip-next"
          type={MaterialIcons}
          onPress={handleNextTrack}
          size={20}
        />
      )}
      <IconButton
        styles={{ marginLeft: 4 }}
        name={volumeButtonName}
        type={Ionicons}
        onPress={handleToggleMute}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  rightControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftControlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  timerControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
});

export default Controls;
