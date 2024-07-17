import {
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import React from 'react';
import type { Icon } from '@expo/vector-icons/build/createIconSet';

type Props = {
  name: string;
  size?: number;
  type: Icon<any, any>;
  styles?: StyleProp<ViewStyle>;
  onPress: () => void;
};

const IconButton: React.FC<Props> = (props) => {
  const size = props.size ?? 18;
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.container, props.styles]}
    >
      <props.type name={props.name} color="white" size={size} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
});

export default IconButton;
