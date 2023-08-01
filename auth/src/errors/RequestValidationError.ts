import { ValidationError } from 'express-validator';
import BaseError from './BaseError';

export class RequestValidationError extends BaseError {
  public statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class (to es5)
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError() {
    return this.errors.flatMap((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path };
      }
      return [];
    });
  }
}
