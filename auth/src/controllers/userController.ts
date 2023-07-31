import User from './../models/User';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

import { RequestValidationError, BadRequestError } from '../errors';

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new RequestValidationError(errors.array()));
  }

  const { password, email } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(new BadRequestError('User already exists'));
  }

  try {
    user = await User.create({ password, email });
    res.status(201).send(user).end();
  } catch (error) {
    console.error(JSON.stringify(error));
    return next(new BadRequestError('temporal error handling'));
  }
}
