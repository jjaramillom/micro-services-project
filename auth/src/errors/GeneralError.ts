import BaseError from './BaseError';

export class GeneralError extends BaseError {
  constructor(public statusCode: number, public message: string) {
    super(message);

    // Only because we are extending a built in class (to es5)
    Object.setPrototypeOf(this, GeneralError.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
