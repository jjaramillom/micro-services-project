import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../errors';

type CommonError = {
  message: string;
  field?: string;
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let formattedErrors: CommonError[] = [{ message: 'something went wrong.' }];
  let errorCode: number = 500;

  if (err instanceof BaseError) {
    formattedErrors = err.serializeError();
    errorCode = err.statusCode;
  }

  res.status(400).send({
    errors: formattedErrors,
  });
};
