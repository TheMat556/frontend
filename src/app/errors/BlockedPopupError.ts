import {CustomError} from "./CostumError";

export class BlockedPopupError extends CustomError {
  constructor(message: string) {
    super("BlockedPopupError", message);
  }
}

