import {CustomError} from "./CostumError";

export class NotAuthenticatedError extends CustomError {
  constructor(message: string) {
    super("NotAuthenticatedError", message);
  }
}

