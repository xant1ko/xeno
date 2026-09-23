import { UserPublic } from '../../users/types/user.type';

// Описываем минимальные данные, которые подписываем внутри access token.
export type JwtPayload = {
  sub: string;
  login: string;
};

// Описываем пользователя, доступного обработчикам после проверки JWT.
export type AuthenticatedUser = UserPublic;

// Внутренний результат аутентификации: токен нужен только контроллеру для Set-Cookie.
// В JSON-ответ он не попадает, поэтому браузерный JavaScript не может его прочитать.
export type AuthResult = {
  access_token: string;
  user: UserPublic;
};
