import {CustomError} from "./CostumError";

export class NoDeviceRunningError extends CustomError {
  constructor(message: string) {
    super("NoDeviceRunningError", message);
  }
}

