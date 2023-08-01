import { sign, verify } from 'jsonwebtoken';
import { IUser } from '../models/User';

type Payload = IUser;

const JWT_KEY = process.env.JWT_KEY!;

export function createToken(user: Payload): string {
  return sign({ email: user.email, id: user.id }, JWT_KEY);
}

export function decodeToken(token: string): Payload {
  return verify(token, JWT_KEY) as Payload;
}
