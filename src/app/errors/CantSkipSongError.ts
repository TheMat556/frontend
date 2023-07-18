import {CustomError} from "./CostumError";

export class CantSkipSongError extends CustomError {
  constructor(message: string) {
    super("CantSkipSongError", message);
  }
}

