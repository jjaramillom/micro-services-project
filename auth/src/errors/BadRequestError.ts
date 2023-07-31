import BaseError from './base-error';

export class BadRequestError extends BaseError {
  public statusCode = 400;

  constructor(public message: string) {
    super(message);

    // Only because we are extending a built in class (to es5)
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeError() {
    return [{ message: this.message }];
  }
}
