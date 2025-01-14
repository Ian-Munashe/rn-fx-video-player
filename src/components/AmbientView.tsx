import { LinearGradient } from "expo-linear-gradient";
import { View, Animated, type ViewStyle } from "react-native";
import {
  FXCrossfadeImage,
  type FXCrossfadeImageProps,
} from "./FXCrossfadeImage";

import { useAmbient } from "../hooks";
import type { AmbientViewProps } from "../types";

/**
 * Renders an ambient view component with a crossfade image and linear gradient.
 *
 * @param {string[]} [colors]
 * - The colors for the ambient linear gradient.
 * @param {string} [videoFrame]
 * - The URI of the videoFrame image.
 * @param {number} [animationDelayMs]
 * - The delay for the animation, in milliseconds.
 * @param {boolean} [props.isFullScreen=false]
 * - Whether the view is in full screen mode.
 * @param {React.ReactNode} [playerItem]
 * - The renderer for the player.
 * @param {React.ReactNode} [children]
 * - The children elements.
 */

const AmbientView: React.FC<AmbientViewProps> = ({
  animationDelayMs = 0,
  isFullScreen = false,
  videoFrame = "https:www.ledr.com/colours/black.jpg",
  colors = ["rgba(0,0,0,0.2)", "rgba(0,0,0,0.5)", "rgba(0,0,0,1)"],
  ...props
}: AmbientViewProps): JSX.Element => {
  const { imageOpacity, gradientOpacity } = useAmbient(animationDelayMs);

  const imageProps: FXCrossfadeImageProps = {
    source: { uri: videoFrame },
    resizeMode: "cover",
    duration: 4000,
    blurRadius: 60,
    style: { width: "100%", height: "100%" },
  };

  const animatedViewStyle: ViewStyle = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  return (
    <View
      style={[{ position: "relative" }, isFullScreen && { height: "100%" }]}
    >
      <Animated.View style={[animatedViewStyle, { opacity: imageOpacity }]}>
        <FXCrossfadeImage {...imageProps} />
      </Animated.View>
      <Animated.View style={[animatedViewStyle, { opacity: gradientOpacity }]}>
        <LinearGradient colors={colors} style={{ flex: 1 }} />
      </Animated.View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View style={[isFullScreen && { height: "100%" }]}>
          {props.playerItem()}
        </View>
        {isFullScreen ? null : props.children}
      </View>
    </View>
  );
};

export default AmbientView;
