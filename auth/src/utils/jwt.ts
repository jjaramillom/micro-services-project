import { sign, verify } from 'jsonwebtoken';
import { IUser } from '../models/User';

type Payload = IUser;

function getJwtKey() {
  return process.env.JWT_KEY!;
}

export function createToken(user: Payload): string {
  return sign({ email: user.email, id: user.id }, getJwtKey());
}

export function decodeToken(token: string): Payload {
  return verify(token, getJwtKey()) as Payload;
}
