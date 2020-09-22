import BaseError from './base-error';

export class DatabaseConnectionError extends BaseError {
  private reason: string = 'Error connecting to database';
  public statusCode = 500;

  constructor() {
    super('Error connecting to database');

    // Only because we are extending a built in class (to es5)
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeError() {
    return [{ message: this.reason }];
  }
}
