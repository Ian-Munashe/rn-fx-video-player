import {
  View,
  Text,
  Animated,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";

import Utils from "../utils";
import IconButton from "./IconButton";
import ErrorComponent from "./ErrorComponent";
import { usePlayerContext } from "../hooks";

interface IPlayerControlsProps {
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
}

/**
 * Renders the controls for the player.
 *
 * @param {boolean} props.isLive - Indicates if the video is live.
 * @param {React.MutableRefObject<any>} props.videoRef - The reference to the video element.
 * @param {() => void} props.handleNextTrack - The function to handle the next track event.
 * @param {() => void} props.handleReload - The function to handle the reload event.
 * @param {() => void} props.onValueChange - The function to handle the value change event.
 * @param {() => void} props.handleToggleMute - The function to handle the toggle mute event.
 * @param {() => void} props.handleTogglePlay - The function to handle the toggle play event.
 * @param {() => void} props.handleFullScreen - The function to handle the full screen event.
 * @param {() => void} props.handlePreviousTrack - The function to handle the previous track event.
 * @param {() => void} props.handleSlidingStart - The function to handle the sliding start event.
 * @param {(e: number, duration: number) => Promise<void>} props.handleSlidingComplete - The function to handle the sliding complete event.
 */
const Controls: React.FC<IPlayerControlsProps> = (props): JSX.Element => {
  const {
    isLoading,
    playback,
    isPlaying,
    isMuted,
    showControls,
    error,
    controlsAnimation,
  } = usePlayerContext();

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
              style={{ height: "100%", width: "100%" }}
              colors={[
                "transparent",
                "rgba(0, 0, 0, 0.2)",
                "rgba(0, 0, 0, 0.8)",
              ]}
            >
              <View style={styles.controlsContainer}>
                {!props.isLive && (
                  <Slider
                    value={playback.positionMillis / playback.durationMillis!}
                    minimumValue={0}
                    maximumValue={1}
                    thumbTintColor={"white"}
                    minimumTrackTintColor="white"
                    maximumTrackTintColor={"white"}
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
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {renderLeftControls(props, isPlaying, isMuted)}
                    {props.isLive ? (
                      <Text style={[styles.text, { fontWeight: "bold" }]}>
                        LIVE
                      </Text>
                    ) : (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
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

/**
 * Renders the right controls for the player, including the full screen button.
 *
 * @param handleFullScreen - The function to call when the full screen button is pressed.
 * @returns The JSX element for the right controls.
 */
const renderRightControls = (handleFullScreen: () => void): JSX.Element => {
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

/**
 * Renders the left controls for the player, including the previous track, play, next track, and volume buttons.
 *
 * @param props.handlePreviousTrack - The function to call when the previous track button is pressed.
 * @param props.handleTogglePlay - The function to call when the play button is pressed.
 * @param props.handleNextTrack - The function to call when the next track button is pressed.
 * @param props.handleToggleMute - The function to call when the mute button is pressed.
 * @param isPlaying - Indicates if the player is currently playing.
 * @param isMuted - Indicates if the player is currently muted.
 */
const renderLeftControls = (
  props: IPlayerControlsProps,
  isPlaying: boolean,
  isMuted: boolean
): JSX.Element => {
  const {
    handlePreviousTrack,
    handleTogglePlay,
    handleNextTrack,
    handleToggleMute,
  } = props;
  const playButtonName: string = isPlaying ? "pause-outline" : "play-outline";
  const volumeButtonName: string = isMuted
    ? "volume-mute-outline"
    : "volume-high-outline";

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
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  controlsContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  rightControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftControlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  timerControlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  text: {
    color: "white",
    fontSize: 12,
  },
});

export default Controls;
