import { StyleSheet, View } from 'react-native';
import { FXVideoPlayer } from 'rn-fx-video-player';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <FXVideoPlayer
          sources={[
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          ]}
          // videoFrameInterval={1500}
          // videoFrame={(url) => console.log(url)}
        />
      </View>
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
