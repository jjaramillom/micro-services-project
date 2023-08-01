import User, { IUser } from './../models/User';
import { Request, Response, NextFunction } from 'express';

import { RequestValidationError, BadRequestError } from '../errors';
import { createToken } from '../utils/jwt';

type UserResponse = Pick<IUser, 'email' | 'id'>;

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

function mapToUserResponse(user: IUser): UserResponse {
  return {
    email: user.email,
    id: user.id,
  };
}

export function login(req: Request, res: Response, next: NextFunction) {
  const jwt = createToken((req as any).user);
  req.session = { jwt };
  res.status(200).end();
}
