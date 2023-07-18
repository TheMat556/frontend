
interface SongDetails {
  songTitle: string;
  artist: string;
  currentImgUrl: string;
  currentProgress: number;
  songDuration: number;
  playingStatus: boolean;
  currentVotes: number;
  neededVotesToSkip: number;
}

function createDefaultSongDetails(): SongDetails {
  return {
    songTitle: "",
    artist: "",
    currentImgUrl: "",
    currentProgress: 0,
    currentVotes: 0,
    neededVotesToSkip: 0,
    playingStatus: false,
    songDuration: 0,
  }
}

export {SongDetails, createDefaultSongDetails}
