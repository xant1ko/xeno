import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { MongoServerError, ObjectId } from 'mongodb';
import { UserDocument, UserPublic } from './types/user.type';
import { UsersRepository } from './users.repository';

@Injectable() // Регистрируем сервис пользовательской логики.
export class UsersService {
  private readonly minPasswordLength: number;
  private readonly maxPasswordLength: number;

  constructor(
    private readonly usersRepository: UsersRepository,
    configService: ConfigService,
  ) { // Получаем repository и параметры пароля через DI.
    this.minPasswordLength = this.getPasswordLength(configService, 'PASSWORD_MIN_LENGTH'); // Загружаем нижнюю границу из окружения.
    this.maxPasswordLength = this.getPasswordLength(configService, 'PASSWORD_MAX_LENGTH'); // Загружаем верхнюю границу из окружения.
    if (this.minPasswordLength > this.maxPasswordLength) { // Не запускаем API с противоречивой конфигурацией.
      throw new Error('PASSWORD_MIN_LENGTH не может быть больше PASSWORD_MAX_LENGTH');
    }
  }

  async create(login: string, password: string): Promise<UserPublic> { // Создаём пользователя и никогда не возвращаем хеш пароля.
    const normalizedLogin = this.normalizeLogin(login); // Формируем ключ уникальности без учёта регистра.
    this.validatePassword(password); // Проверяем пароль до затратного хеширования.
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id }); // Используем рекомендуемый вариант Argon2 для паролей.

    try {
      const user = await this.usersRepository.create({
        login: login.trim(),
        normalized_login: normalizedLogin,
        password_hash: passwordHash,
      });
      return this.toPublic(user);
    } catch (error) {
      if (this.isDuplicateLoginError(error)) { // Преобразуем техническую ошибку уникального индекса в понятный HTTP-ответ.
        throw new ConflictException('Логин уже занят');
      }
      throw error;
    }
  }

  findByNormalizedLogin(login: string): Promise<UserDocument | null> { // Оставляем доступ к хешу только внутренней auth-логике будущего PR.
    return this.usersRepository.findByNormalizedLogin(this.normalizeLogin(login));
  }

  findById(id: string): Promise<UserDocument | null> { // Подготавливаем поиск пользователя по строковому идентификатору.
    if (!ObjectId.isValid(id)) {
      return Promise.resolve(null);
    }
    return this.usersRepository.findById(new ObjectId(id));
  }

  toPublic(user: UserDocument): UserPublic { // Явно исключаем password_hash из публичной модели.
    return {
      id: user._id.toHexString(),
      login: user.login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  private normalizeLogin(login: string): string { // Унифицируем логины для поиска и уникального индекса.
    const normalizedLogin = login.trim().toLowerCase();
    if (!normalizedLogin) {
      throw new BadRequestException('Логин не может быть пустым');
    }
    return normalizedLogin;
  }

  private validatePassword(password: string): void { // Не хешируем заведомо неподходящие пароли.
    if (password.length < this.minPasswordLength || password.length > this.maxPasswordLength) {
      throw new BadRequestException(`Пароль должен содержать от ${this.minPasswordLength} до ${this.maxPasswordLength} символов`);
    }
  }

  private getPasswordLength(configService: ConfigService, key: string): number { // Преобразуем строковую env-переменную в положительное целое число.
    const value = Number(configService.getOrThrow<string>(key));
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(`${key} должен быть положительным целым числом`);
    }
    return value;
  }

  private isDuplicateLoginError(error: unknown): boolean { // Опознаём ошибку unique index из MongoDB.
    return error instanceof MongoServerError && error.code === 11000;
  }
}
