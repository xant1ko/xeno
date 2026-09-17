import { UserPublic } from '../../users/types/user.type';

// Описываем минимальные данные, которые подписываем внутри access token.
export type JwtPayload = {
  sub: string;
  login: string;
};

// Описываем пользователя, доступного обработчикам после проверки JWT.
export type AuthenticatedUser = UserPublic;
