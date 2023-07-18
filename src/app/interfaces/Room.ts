interface Room {
  createdAt: string,
  currentSong: string,
  currentlyPlaying: boolean,
  guestCanPause: boolean,
  roomIdentifier: string,
  voteList: string[],
  voteListLength: number,
  votesToSkip: number
}

function createDefaultRoom(): Room
{
  return {
    createdAt: "",
    currentSong: "",
    currentlyPlaying: false,
    guestCanPause: false,
    roomIdentifier: "",
    voteList: [],
    voteListLength: 0,
    votesToSkip: 0
  };
}

export {Room, createDefaultRoom}

