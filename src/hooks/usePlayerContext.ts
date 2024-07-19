import { useContext } from "react";
import { type PlayerState, PlayerContext } from "../context";

export const usePlayerContext = () => {
  const player = useContext(PlayerContext);

  if (player === null) {
    throw new Error("usePlayerContext must be used within a PlayerContext");
  }

  return player as PlayerState;
};
