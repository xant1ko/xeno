import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './types/auth.type';

@Injectable() // Регистрируем бизнес-логику регистрации, входа и выпуска токенов.
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> { // Создаём пользователя и сразу выдаём ему access token.
    const user = await this.usersService.create(dto.login, dto.password);
    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> { // Проверяем учётные данные и выдаём новый access token.
    const user = await this.usersService.findByNormalizedLogin(dto.login);
    if (!user || !(await argon2.verify(user.password_hash, dto.password))) {
      throw new UnauthorizedException('Неверный логин или пароль'); // Не раскрываем, существует ли указанный логин.
    }
    return this.createAuthResponse(this.usersService.toPublic(user));
  }

  private createAuthResponse(user: ReturnType<UsersService['toPublic']>): AuthResponseDto { // Формируем единый ответ для регистрации и входа.
    const payload: JwtPayload = { sub: user.id, login: user.login };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
