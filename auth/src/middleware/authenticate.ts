import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { UnathorizedError } from '../errors/UnathorizedError';
import { decodeToken } from '../utils/jwt';

// Middleware to extract Basic Auth credentials
export async function basicAuthentication(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnathorizedError('Invalid authentication method'));
  }

  const authData = authHeader.split(' ');
  if (authData.length !== 2 || authData[0] !== 'Basic') {
    return next(new UnathorizedError('Invalid authentication method'));
  }

  const credentials = Buffer.from(authData[1], 'base64').toString('utf-8');
  const [email, password] = credentials.split(':');

  const user = await User.findOne({ email });

  if (!user || !(await user.isPasswordValid(password))) {
    return next(new UnathorizedError('User does not exist or password is wrong'));
  }

  // @ts-ignore
  req.currentUser = user;

  next();
}

export async function jwtAuthentication(req: Request, res: Response, next: NextFunction) {
  const jwt = req.session?.jwt;

  if (!jwt) {
    return next(new UnathorizedError('Invalid authentication method'));
  }
  try {
    const { email } = decodeToken(jwt);
    const user = await User.findOne({ email });
    // @ts-ignore
    req.currentUser = user;
  } catch (error) {
    return next(new UnathorizedError('Invalid JWT'));
  }
  // TODO validate expiration

  next();
}
