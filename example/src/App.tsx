import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { FXVideoPlayer } from 'rn-fx-video-player';

export default function App() {
  const [hidden, setHidden] = React.useState(false);

  return (
    <View style={styles.container}>
      <StatusBar hidden={hidden} style="light" />
      <FXVideoPlayer
        sources={['https://aweencore-tcl.amagi.tv/playlist.m3u8']}
        onFullScreenUpdate={(value) => setHidden(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});
