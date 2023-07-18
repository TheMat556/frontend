import {CustomError} from "./CostumError";

export class OnlyHostPrivilegeError extends CustomError {
  constructor(message: string) {
    super("OnlyHostPrivilegeError", message);
  }
}

