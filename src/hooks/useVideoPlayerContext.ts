import { useContext } from 'react';
import { type PlayerState, VideoPlayerContext } from '../context';

export const useVideoPlayerContext = () => {
  const player = useContext(VideoPlayerContext);

  if (player === null) {
    throw new Error(
      'useVideoPlayerContext must be used within a VideoPlayerContext'
    );
  }

  return player as PlayerState;
};
