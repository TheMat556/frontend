import {CustomError} from "./CostumError";

export class NoLoginRequired extends CustomError {
  constructor(message: string) {
    super("NoLoginRequired", message);
  }
}
