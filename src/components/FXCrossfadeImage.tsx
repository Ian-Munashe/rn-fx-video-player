import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  type EasingFunction,
  type ImageProps,
  type ImageSourcePropType,
  StyleSheet,
  View,
} from "react-native";

import { isEqual } from "../utils";
import { usePrevious } from "../hooks";

export interface FXCrossfadeImageProps extends ImageProps {
  duration?: number;
  easing?: EasingFunction;
  children?: React.ReactNode;
  reverseFade?: boolean;
}

export const FXCrossfadeImage: React.FC<FXCrossfadeImageProps> = ({
  duration = 500,
  easing = Easing.ease,
  reverseFade = false,
  ...props
}: FXCrossfadeImageProps) => {
  const src = props.source || {};

  const prevSource = usePrevious(src);
  const nextSource = useRef<ImageSourcePropType>();
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [oldSource, setOldSource] = useState<ImageSourcePropType>(src);
  const [newSource, setNewSource] = useState<ImageSourcePropType>();

  useLayoutEffect(() => {
    if (
      prevSource &&
      !isEqual(props.source as ImageSourcePropType, prevSource)
    ) {
      if (!nextSource.current) {
        setNewSource(props.source);
      }

      nextSource.current = props.source;
    }
  }, [props.source, prevSource]);

  const handleUpdate = useCallback(() => {
    setNewSource(nextSource.current);
    animatedOpacity.setValue(0);

    if (isEqual(oldSource, nextSource.current)) {
      nextSource.current = undefined;
    }
  }, [animatedOpacity, oldSource]);

  const handleLoad = useCallback(() => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver: true,
    }).start(() => {
      newSource && !isEqual(oldSource, newSource)
        ? setOldSource(newSource)
        : handleUpdate();
    });
  }, [animatedOpacity, oldSource, newSource, duration, easing, handleUpdate]);

  const reverseOpacity = reverseFade
    ? animatedOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      })
    : 1;

  return (
    <View style={[styles.root, props.style]}>
      <Animated.Image
        {...props}
        style={[styles.image, { opacity: reverseOpacity }]}
        source={oldSource}
        fadeDuration={0}
        onLoad={handleUpdate}
      />
      {newSource && (
        <Animated.Image
          {...props}
          style={[styles.image, { opacity: animatedOpacity }]}
          source={newSource}
          fadeDuration={0}
          onLoad={handleLoad}
        />
      )}
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});
