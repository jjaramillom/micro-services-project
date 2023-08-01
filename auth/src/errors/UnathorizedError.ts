import BaseError from './BaseError';

export class UnathorizedError extends BaseError {
  public statusCode = 401;

  constructor(public message: string) {
    super(message);

    // Only because we are extending a built in class (to es5)
    Object.setPrototypeOf(this, UnathorizedError.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
