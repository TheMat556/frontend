import {CustomError} from "./CostumError";

export class CantTogglePlayingStateError extends CustomError {
  constructor(message: string) {
    super("CantTogglePlayingStateError", message);
  }
}

