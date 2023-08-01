import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import { RequestValidationError } from '../errors';

// Middleware to extract Basic Auth credentials
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new RequestValidationError(errors.array()));
  }

  next();
}
