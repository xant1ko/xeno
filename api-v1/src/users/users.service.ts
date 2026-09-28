import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { MongoServerError, ObjectId } from 'mongodb';
import { UserDocument, UserPublic } from './types/user.type';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly minPasswordLength: number;
  private readonly maxPasswordLength: number;

  constructor(
    private readonly usersRepository: UsersRepository,
    configService: ConfigService,
  ) {
    this.minPasswordLength = this.getPasswordLength(configService, 'PASSWORD_MIN_LENGTH');
    this.maxPasswordLength = this.getPasswordLength(configService, 'PASSWORD_MAX_LENGTH');
    if (this.minPasswordLength > this.maxPasswordLength) {
      throw new Error('PASSWORD_MIN_LENGTH не может быть больше PASSWORD_MAX_LENGTH');
    }
  }

  async create(login: string, password: string): Promise<UserPublic> {
    const normalizedLogin = this.normalizeLogin(login);
    this.validatePassword(password);
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    try {
      const user = await this.usersRepository.create({
        login: login.trim(),
        normalized_login: normalizedLogin,
        password_hash: passwordHash,
      });
      return this.toPublic(user);
    } catch (error) {
      if (this.isDuplicateLoginError(error)) {
        throw new ConflictException('Логин уже занят');
      }
      throw error;
    }
  }

  findByNormalizedLogin(login: string): Promise<UserDocument | null> {
    return this.usersRepository.findByNormalizedLogin(this.normalizeLogin(login));
  }

  findById(id: string): Promise<UserDocument | null> {
    if (!ObjectId.isValid(id)) {
      return Promise.resolve(null);
    }
    return this.usersRepository.findById(new ObjectId(id));
  }

  toPublic(user: UserDocument): UserPublic {
    return {
      id: user._id.toHexString(),
      login: user.login,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  private normalizeLogin(login: string): string {
    const normalizedLogin = login.trim().toLowerCase();
    if (!normalizedLogin) {
      throw new BadRequestException('Логин не может быть пустым');
    }
    return normalizedLogin;
  }

  private validatePassword(password: string): void {
    if (password.length < this.minPasswordLength || password.length > this.maxPasswordLength) {
      throw new BadRequestException(`Пароль должен содержать от ${this.minPasswordLength} до ${this.maxPasswordLength} символов`);
    }
  }

  private getPasswordLength(configService: ConfigService, key: string): number {
    const value = Number(configService.getOrThrow<string>(key));
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(`${key} должен быть положительным целым числом`);
    }
    return value;
  }

  private isDuplicateLoginError(error: unknown): boolean {
    return error instanceof MongoServerError && error.code === 11000;
  }
}
