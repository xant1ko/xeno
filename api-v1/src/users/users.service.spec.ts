import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { MongoServerError, ObjectId } from 'mongodb';
import { UserDocument } from './types/user.type';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

// Изолируем unit-тест от нативного Argon2-бинарника: сам алгоритм проверяется библиотекой, здесь важна передача хеша в repository.
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

// Собираем минимальный ConfigService с параметрами, которые UsersService читает при создании.
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
    // Каждый тест получает чистые моки: вызовы одного сценария не влияют на другой.
    repository = {
      create: jest.fn(),
      findByNormalizedLogin: jest.fn(),
      findById: jest.fn(),
    };
    // Передаём repository и env-конфигурацию напрямую, не поднимая Nest-приложение.
    service = new UsersService(repository as unknown as UsersRepository, createConfigService());
    jest.mocked(argon2.hash).mockResolvedValue('$argon2id$mock-password-hash'); // Делаем результат хеширования стабильным для assertions.
    jest.mocked(argon2.verify).mockResolvedValue(true); // Подтверждаем, что тестовый хеш соответствует исходному паролю.
  });

  it('normalizes the login, hashes the password, and returns no hash to callers', async () => {
    // Фиксируем дату, чтобы публичный результат можно было сравнить полностью.
    const createdAt = new Date('2026-09-17T10:00:00.000Z');
    // Repository имитирует MongoDB: принимает данные, добавляет служебные поля и возвращает документ.
    repository.create.mockImplementation(async data => ({
      _id: new ObjectId('66e4fa78469290f19f5642b1'),
      ...data,
      created_at: createdAt,
      updated_at: createdAt,
    }));

    // Пробелы и регистр в логине намеренно проверяются входными значениями.
    const user = await service.create('  Alex  ', 'secure-password');
    // Забираем фактические данные, которые сервис передал на сохранение.
    const savedUser = repository.create.mock.calls[0][0];

    // Оригинальный логин хранится без внешних пробелов для отображения пользователю.
    expect(savedUser.login).toBe('Alex');
    // Нормализованный логин используется уникальным индексом и не зависит от регистра.
    expect(savedUser.normalized_login).toBe('alex');
    // Исходный пароль не должен попадать в MongoDB.
    expect(savedUser.password_hash).not.toBe('secure-password');
    // Вместо этого Argon2-хеш обязан успешно проверяться исходным паролем.
    await expect(argon2.verify(savedUser.password_hash, 'secure-password')).resolves.toBe(true);
    // Публичная модель исключает password_hash даже после успешного создания пользователя.
    expect(user).toEqual({
      id: '66e4fa78469290f19f5642b1',
      login: 'Alex',
      created_at: createdAt,
      updated_at: createdAt,
    });
  });

  it('rejects empty logins and invalid password lengths before writing to MongoDB', async () => {
    // Не создаём пользователя с пустым логином после trim.
    await expect(service.create('   ', 'secure-password')).rejects.toBeInstanceOf(BadRequestException);
    // Не вызываем дорогое хеширование и запись для слишком короткого пароля.
    await expect(service.create('alex', 'short')).rejects.toBeInstanceOf(BadRequestException);
    // Обе ошибки происходят до обращения к persistence-слою.
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('converts a duplicate login index error into a conflict', async () => {
    // MongoDB возвращает code 11000 при нарушении уникального индекса normalized_login.
    repository.create.mockRejectedValue(new MongoServerError({ ok: 0, code: 11000, errmsg: 'duplicate key' }));

    await expect(service.create('alex', 'secure-password')).rejects.toBeInstanceOf(ConflictException);
  });

  it('uses the normalized login when looking up a user', async () => {
    // Вход в будущем должен быть нечувствительным к пробелам и регистру логина.
    await service.findByNormalizedLogin('  AlEx ');

    expect(repository.findByNormalizedLogin).toHaveBeenCalledWith('alex');
  });

  it('does not query MongoDB with an invalid object identifier', async () => {
    // Некорректный ObjectId нельзя передавать драйверу MongoDB.
    await expect(service.findById('invalid-id')).resolves.toBeNull();
    expect(repository.findById).not.toHaveBeenCalled();
  });
});
