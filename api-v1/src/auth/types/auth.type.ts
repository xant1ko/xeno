import { UserPublic } from '../../users/types/user.type';
export type JwtPayload = {
  sub: string;
  login: string;
};
export type AuthenticatedUser = UserPublic;
export type AuthResult = {
  access_token: string;
  user: UserPublic;
};
