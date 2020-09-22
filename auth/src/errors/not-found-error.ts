import BaseError from './base-error';

export class NotFoundError extends BaseError {
  private reason: string = 'Not found';
  public statusCode = 500;

  constructor() {
    super('Route not found');

    // Only because we are extending a built in class (to es5)
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError() {
    return [{ message: this.reason }];
  }
}
