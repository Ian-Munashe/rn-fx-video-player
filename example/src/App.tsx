import React from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmbientView, FXVideoPlayer } from "rn-fx-video-player";

import { useFullScreenStore } from "./store";

export default function App() {
  const animationDelay = 15000;
  const { fullScreen } = useFullScreenStore();
  const [frame, setFrame] = React.useState<string | undefined>();

  const playerItem = () => {
    return (
      <SafeAreaView>
        <FXVideoPlayer
          sources={[
            "https://lightning-traceurban-samsungau.amagi.tv/playlist.m3u8",
          ]}
          videoFrameInterval={animationDelay}
          onVideoFrame={(value) => setFrame(value)}
          onFullScreenUpdate={(value: boolean) => {
            useFullScreenStore.setState({ fullScreen: value });
          }}
        />
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={fullScreen} style="light" />

      <AmbientView
        videoFrame={frame}
        playerItem={playerItem}
        isFullScreen={fullScreen}
        animationDelayMs={animationDelay}
      >
        <View style={{ width: "100%", padding: 12 }}>
          <Text style={{ color: "white" }}>Hello World</Text>
          <Text style={{ color: "white" }}>Hello World</Text>
          <Text style={{ color: "white" }}>Hello World</Text>
          <Text style={{ color: "white" }}>Hello World</Text>
        </View>
      </AmbientView>
      <ScrollView style={{ flex: 1 }}>
        {[...Array(60)].map((_, index) => (
          <Text key={index} style={{ color: "white" }}>
            Comments
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});
