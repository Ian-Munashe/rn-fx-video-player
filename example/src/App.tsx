import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View } from 'react-native';
import { FXVideoPlayer } from 'rn-fx-video-player';

export default function App() {
  const [frame, setFrame] = React.useState('');
  const [hidden, setHidden] = React.useState(false);

  return (
    <View style={styles.container}>
      <StatusBar hidden={hidden} style="light" />
      <FXVideoPlayer
        sources={[
          'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'https://aweencore-tcl.amagi.tv/playlist.m3u8',
        ]}
        videoFrameInterval={15000}
        videoFrame={(url) => setFrame(url)}
        onFullScreenUpdate={(value) => setHidden(value)}
      />
      {!hidden && (
        <View style={{ aspectRatio: 16 / 9, width: '100%' }}>
          {frame && (
            <Image
              source={{ uri: frame }}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </View>
      )}
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
