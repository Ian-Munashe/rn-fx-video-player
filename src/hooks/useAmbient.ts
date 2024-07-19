import React from 'react';
import { Animated, Easing } from 'react-native';

export const useAmbient = (delay: number) => {
  const imageOpacity = React.useRef(new Animated.Value(0)).current;
  const gradientOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const animation = Animated.parallel([
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
        Animated.timing(gradientOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.ease,
        }),
      ]);
      animation.start(() => animation.stop());
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return { imageOpacity, gradientOpacity };
};
