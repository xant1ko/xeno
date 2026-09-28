import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ObjectId } from 'mongodb';
import { UserDocument, UserPublic } from '../users/types/user.type';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
jest.mock('argon2', () => ({
  argon2id: 2,
  hash: jest.fn(),
  verify: jest.fn(),
}));

type UsersServiceMock = {
  create: jest.Mock<Promise<UserPublic>, [string, string]>;
  findByNormalizedLogin: jest.Mock<Promise<UserDocument | null>, [string]>;
  toPublic: jest.Mock<UserPublic, [UserDocument]>;
};

type JwtServiceMock = {
  sign: jest.Mock<string, [{ sub: string; login: string }]>;
};

describe('AuthService', () => {
  let usersService: UsersServiceMock;
  let jwtService: JwtServiceMock;
  let service: AuthService;

  beforeEach(() => {
    usersService = {
      create: jest.fn(),
      findByNormalizedLogin: jest.fn(),
      toPublic: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('signed-access-token') };
    service = new AuthService(
      usersService as unknown as UsersService,
      jwtService as unknown as JwtService,
    );
    jest.mocked(argon2.verify).mockResolvedValue(true);
  });

  it('registers a user and returns an access token', async () => {
    const user: UserPublic = {
      id: '66e4fa78469290f19f5642b1',
      login: 'alex',
      created_at: new Date('2026-09-17T10:00:00.000Z'),
      updated_at: new Date('2026-09-17T10:00:00.000Z'),
    };
    usersService.create.mockResolvedValue(user);

    const result = await service.register({ login: 'alex', password: 'secure-password' });

    expect(usersService.create).toHaveBeenCalledWith('alex', 'secure-password');
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, login: user.login });
    expect(result).toEqual({ access_token: 'signed-access-token', user });
  });

  it('logs in a user when the password matches the Argon2 hash', async () => {
    const passwordHash = '$argon2id$mock-password-hash';
    const document: UserDocument = {
      _id: new ObjectId('66e4fa78469290f19f5642b1'),
      login: 'alex',
      normalized_login: 'alex',
      password_hash: passwordHash,
      created_at: new Date('2026-09-17T10:00:00.000Z'),
      updated_at: new Date('2026-09-17T10:00:00.000Z'),
    };
    const user: UserPublic = {
      id: document._id.toHexString(),
      login: document.login,
      created_at: document.created_at,
      updated_at: document.updated_at,
    };
    usersService.findByNormalizedLogin.mockResolvedValue(document);
    usersService.toPublic.mockReturnValue(user);

    const result = await service.login({ login: 'alex', password: 'secure-password' });

    expect(usersService.findByNormalizedLogin).toHaveBeenCalledWith('alex');
    expect(result).toEqual({ access_token: 'signed-access-token', user });
  });

  it('returns the same unauthorized error for an unknown login and an incorrect password', async () => {
    usersService.findByNormalizedLogin.mockResolvedValue(null);
    await expect(service.login({ login: 'missing', password: 'secure-password' })).rejects.toBeInstanceOf(UnauthorizedException);
    jest.mocked(argon2.verify).mockResolvedValue(false);
    usersService.findByNormalizedLogin.mockResolvedValue({
      _id: new ObjectId(),
      login: 'alex',
      normalized_login: 'alex',
      password_hash: '$argon2id$another-mock-password-hash',
      created_at: new Date(),
      updated_at: new Date(),
    });
    await expect(service.login({ login: 'alex', password: 'wrong-password' })).rejects.toBeInstanceOf(UnauthorizedException);
    expect(jwtService.sign).not.toHaveBeenCalled();
  });

  it('keeps the conflict error from user creation during registration', async () => {
    usersService.create.mockRejectedValue(new ConflictException('Логин уже занят'));

    await expect(service.register({ login: 'alex', password: 'secure-password' })).rejects.toBeInstanceOf(ConflictException);
  });
});
