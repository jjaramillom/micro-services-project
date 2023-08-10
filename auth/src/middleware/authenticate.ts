import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '@jjaramillom-tickets/common';

import User from '../models/User';

// Middleware to extract Basic Auth credentials
export async function basicAuthentication(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('Invalid authentication method'));
  }

  const authData = authHeader.split(' ');
  if (authData.length !== 2 || authData[0] !== 'Basic') {
    return next(new UnauthorizedError('Invalid authentication method'));
  }

  const credentials = Buffer.from(authData[1], 'base64').toString('utf-8');
  const [email, password] = credentials.split(':');

  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordValid(password))) {
    return next(new UnauthorizedError('User does not exist or password is wrong'));
  }

  // @ts-ignore
  req.currentUser = user;

  next();
}
