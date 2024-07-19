import { AntDesign } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { usePlayerContext } from "../hooks";

/**
 * A component that displays an error message and a reload button.
 * @param {Function} props.onReload - The function to call when the reload button is pressed.
 */
const ErrorComponent: React.FC<{ onReload: () => void }> = (
  props
): JSX.Element | null => {
  const player = usePlayerContext();

  if (!player.error) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <AntDesign name="warning" color="lightgrey" size={25} />
        <Text style={styles.text}>{player.error}</Text>
        <TouchableOpacity style={styles.button} onPress={props.onReload}>
          <Text style={[styles.text, styles.marginHorizontal]}>Reload</Text>
          <AntDesign name="reload1" color="white" size={12} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  container: { alignItems: "center", maxWidth: 280 },
  text: {
    color: "white",
    textAlign: "center",
    marginVertical: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  marginHorizontal: { marginHorizontal: 4 },
});

export default ErrorComponent;
