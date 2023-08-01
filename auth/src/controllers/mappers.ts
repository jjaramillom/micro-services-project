import { IUser } from './../models/User';

type UserResponse = Pick<IUser, 'email' | 'id'>;

export function mapToUserResponse(user: IUser): UserResponse {
  return {
    email: user.email,
    id: user.id,
  };
}
