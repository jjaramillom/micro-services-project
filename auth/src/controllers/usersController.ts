import { Request, Response, NextFunction } from 'express';

import { IUser } from './../models/User';
import { mapToUserResponse } from './mappers';

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  const user = req.tokenPayload;

  res.status(200).send(mapToUserResponse(user)).end();
}

// TODO move this to .d.ts
declare global {
  namespace Express {
    interface Request {
      currentUser: IUser;
      tokenPayload: IUser;
    }
  }
}
