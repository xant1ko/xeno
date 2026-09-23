import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResult } from './types/auth.type';

// Контроллер получает AuthService как зависимость, поэтому не загружаем нативный Argon2 в unit-тесте.
jest.mock('argon2', () => ({
  argon2id: 2,
  hash: jest.fn(),
  verify: jest.fn(),
}));

type AuthServiceMock = {
  register: jest.Mock<Promise<AuthResult>>;
  login: jest.Mock<Promise<AuthResult>>;
};

type ResponseMock = {
  cookie: jest.Mock;
  clearCookie: jest.Mock;
};

describe('AuthController', () => {
  let authService: AuthServiceMock;
  let response: ResponseMock;
  let controller: AuthController;

  beforeEach(() => {
    // Контроллер тестируется без HTTP-сервера: достаточно проверить заголовок, который он формирует.
    authService = {
      register: jest.fn(),
      login: jest.fn(),
    };
    response = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };
    const configService = {
      // Имитируем production: флаг Secure обязан попасть в cookie при HTTPS-развёртывании.
      get: jest.fn((key: string, defaultValue: unknown) => {
        if (key === 'JWT_COOKIE_SECURE') return 'true';
        if (key === 'JWT_COOKIE_MAX_AGE_MS') return 86_400_000;
        return defaultValue;
      }),
    };
    controller = new AuthController(
      authService as unknown as AuthService,
      configService as unknown as ConfigService,
    );
  });

  it('stores the token only in an httpOnly cookie after registration', async () => {
    const result: AuthResult = {
      access_token: 'signed-access-token',
      user: {
        id: '66e4fa78469290f19f5642b1',
        login: 'alex',
        created_at: new Date('2026-09-17T10:00:00.000Z'),
        updated_at: new Date('2026-09-17T10:00:00.000Z'),
      },
    };
    authService.register.mockResolvedValue(result);

    const body = await controller.register(
      { login: 'alex', password: 'secure-password' },
      response as unknown as Response,
    );

    // В body нет токена, поэтому фронтенд не сможет положить JWT в localStorage по ошибке.
    expect(body).toEqual({ user: result.user });
    expect(response.cookie).toHaveBeenCalledWith('xeno_access_token', result.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 86_400_000,
      path: '/api/v1',
    });
  });

  it('clears the same scoped cookie during logout', () => {
    controller.logout(response as unknown as Response);

    // Совпадающие path и security-атрибуты гарантируют, что браузер удалит именно JWT-cookie.
    // maxAge отсутствует: Express выставляет истёкший срок, а не продлевает текущую cookie.
    expect(response.clearCookie).toHaveBeenCalledWith('xeno_access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/api/v1',
    });
  });
});
