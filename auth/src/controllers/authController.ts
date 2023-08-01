import User from './../models/User';
import { Request, Response, NextFunction } from 'express';

import { BadRequestError } from '../errors';
import { createToken } from '../utils/jwt';
import { mapToUserResponse } from './mappers';

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { password, email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return next(new BadRequestError('User already exists'));
  }

  try {
    user = await User.create({ password, email });
  } catch (error) {
    console.error(JSON.stringify(error));
    return next(new BadRequestError('temporal error handling'));
  }

  const jwt = createToken(user);
  req.session = { jwt };
  res.status(201).send(mapToUserResponse(user)).end();
}

export function login(req: Request, res: Response, next: NextFunction) {
  const jwt = createToken(req.currentUser);
  req.session = { jwt };
  res.status(200).end();
}

export function logout(req: Request, res: Response, next: NextFunction) {
  req.session = null;
  res.status(200).end();
}
