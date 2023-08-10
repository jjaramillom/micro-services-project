import User from './../models/User';
import { Request, Response, NextFunction } from 'express';
import { GeneralError, createJwtToken } from '@jjaramillom-tickets/common';

import { mapToUserResponse } from './mappers';

export async function signUp(req: Request, res: Response, next: NextFunction) {
  const { password, email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return next(new GeneralError(409, 'User already exists'));
  }

  try {
    user = await User.create({ password, email });
  } catch (error) {
    console.error(JSON.stringify(error));
    return next(new GeneralError(500, 'Internal database error'));
  }

  const jwt = createJwtToken({ email: user.email, id: user.id });
  req.session = { jwt };
  res.status(201).send(mapToUserResponse(user)).end();
}

export function login(req: Request, res: Response, next: NextFunction) {
  const jwt = createJwtToken({ email: req.currentUser.email, id: req.currentUser.id });
  req.session = { jwt };
  res.status(200).end();
}

export function logout(req: Request, res: Response, next: NextFunction) {
  req.session = null;
  res.status(200).end();
}
