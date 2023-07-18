import {CustomError} from "./CostumError";

export class AlreadyAuthenticated extends CustomError {
  constructor(message: string) {
    super("AlreadyAuthenticated", message);
  }
}
