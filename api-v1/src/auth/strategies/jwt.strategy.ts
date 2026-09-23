import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { AuthenticatedUser, JwtPayload } from '../types/auth.type';

const accessTokenCookieName = 'xeno_access_token'; // Должно совпадать с именем cookie, выставляемым AuthController.

@Injectable() // Регистрируем JWT strategy в Passport.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // Cookie-parser заполняет request.cookies до вызова Passport strategy.
      // Не читаем Authorization, чтобы браузерный клиент не хранил JWT в JavaScript.
      jwtFromRequest: request => request?.cookies?.[accessTokenCookieName] ?? null,
      ignoreExpiration: false, // Passport отклоняет просроченные токены до вызова validate.
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'), // Не допускаем запуска с отсутствующим секретом.
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> { // Проверяем, что пользователь из токена всё ещё существует.
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Пользователь из токена не найден');
    }
    return this.usersService.toPublic(user); // В request передаём только безопасную публичную модель.
  }
}
