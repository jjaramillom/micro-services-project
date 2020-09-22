import { ValidationError } from 'express-validator';
import BaseError from './base-error';

export class RequestValidationError extends BaseError {
  public statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class (to es5)
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError() {
    return this.errors.map((err) => {
      return {
        message: err.msg,
        field: err.param,
      };
    });
  }
}
