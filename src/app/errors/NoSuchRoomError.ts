import {CustomError} from "./CostumError";

export class NoSuchRoomError extends CustomError {
  constructor(message: string) {
    super("NoSuchRoomError", message);
  }
}
