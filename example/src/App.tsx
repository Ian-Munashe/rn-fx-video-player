import React from 'react';
import { create } from 'zustand';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AmbientView, FXVideoPlayer } from 'rn-fx-video-player';

const useFullScreenStore = create<{ fullScreen: boolean }>((_) => ({
  fullScreen: false,
}));

export default function App() {
  const animationDelay = 15000;
  const { fullScreen } = useFullScreenStore();
  const [frame, setFrame] = React.useState<string | undefined>();

  const playerItem = () => {
    return (
      <SafeAreaView>
        <FXVideoPlayer
          sources={[
            'https://lightning-traceurban-samsungau.amagi.tv/playlist.m3u8',
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
        <View style={{ height: 200 }} />
      </AmbientView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
