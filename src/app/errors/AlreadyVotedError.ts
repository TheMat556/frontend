import {CustomError} from "./CostumError";

export class AlreadyVotedError extends CustomError {
  constructor(message: string) {
    super("AlreadyVotedError", message);
  }
}

