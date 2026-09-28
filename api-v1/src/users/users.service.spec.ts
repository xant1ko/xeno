import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { MongoServerError, ObjectId } from 'mongodb';
import { UserDocument } from './types/user.type';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
jest.mock('argon2', () => ({
  argon2id: 2,
  hash: jest.fn(),
  verify: jest.fn(),
}));

type UsersRepositoryMock = {
  create: jest.Mock<Promise<UserDocument>, [Parameters<UsersRepository['create']>[0]]>;
  findByNormalizedLogin: jest.Mock;
  findById: jest.Mock;
};
const createConfigService = (): ConfigService => ({
  getOrThrow: jest.fn((key: string) => ({
    PASSWORD_MIN_LENGTH: '8',
    PASSWORD_MAX_LENGTH: '128',
  })[key]),
}) as unknown as ConfigService;

describe('UsersService', () => {
  let repository: UsersRepositoryMock;
  let service: UsersService;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByNormalizedLogin: jest.fn(),
      findById: jest.fn(),
    };
    service = new UsersService(repository as unknown as UsersRepository, createConfigService());
    jest.mocked(argon2.hash).mockResolvedValue('$argon2id$mock-password-hash');
    jest.mocked(argon2.verify).mockResolvedValue(true);
  });

  it('normalizes the login, hashes the password, and returns no hash to callers', async () => {
    const createdAt = new Date('2026-09-17T10:00:00.000Z');
    repository.create.mockImplementation(async data => ({
      _id: new ObjectId('66e4fa78469290f19f5642b1'),
      ...data,
      created_at: createdAt,
      updated_at: createdAt,
    }));
    const user = await service.create('  Alex  ', 'secure-password');
    const savedUser = repository.create.mock.calls[0][0];
    expect(savedUser.login).toBe('Alex');
    expect(savedUser.normalized_login).toBe('alex');
    expect(savedUser.password_hash).not.toBe('secure-password');
    await expect(argon2.verify(savedUser.password_hash, 'secure-password')).resolves.toBe(true);
    expect(user).toEqual({
      id: '66e4fa78469290f19f5642b1',
      login: 'Alex',
      created_at: createdAt,
      updated_at: createdAt,
    });
  });

  it('rejects empty logins and invalid password lengths before writing to MongoDB', async () => {
    await expect(service.create('   ', 'secure-password')).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.create('alex', 'short')).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('converts a duplicate login index error into a conflict', async () => {
    repository.create.mockRejectedValue(new MongoServerError({ ok: 0, code: 11000, errmsg: 'duplicate key' }));

    await expect(service.create('alex', 'secure-password')).rejects.toBeInstanceOf(ConflictException);
  });

  it('uses the normalized login when looking up a user', async () => {
    await service.findByNormalizedLogin('  AlEx ');

    expect(repository.findByNormalizedLogin).toHaveBeenCalledWith('alex');
  });

  it('does not query MongoDB with an invalid object identifier', async () => {
    await expect(service.findById('invalid-id')).resolves.toBeNull();
    expect(repository.findById).not.toHaveBeenCalled();
  });
});
