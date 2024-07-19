# rn-fx-video-player

A react native video player based on expo-av with ambient mode that enhances user engagement, similar to the one found on YouTube. This feature allows you to create visually captivating backgrounds that seamlessly complement your video content, fostering a more immersive viewing experience for your users.

## Installation

```sh
npm install rn-fx-video-player
```

## Usage

```js
import { AmbientView, FXVideoPlayer } from 'rn-fx-video-player';

// ...

export default function App() {
  const animationDelay = 15000;
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);
  const [frame, setFrame] = React.useState<string | undefined>();

  const playerItem = () => {
    return (
      <SafeAreaView>
        <FXVideoPlayer
          sources={['videoUri']}
          videoFrameInterval={animationDelay}
          onVideoFrame={(value) => setFrame(value)}
          onFullScreenUpdate={(value) => setFullScreen(value)}
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
        {/* children */}
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
