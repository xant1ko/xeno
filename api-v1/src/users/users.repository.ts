import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { MONGO_DB } from '../database/database.constants';
import { CreateUserData, UserDocument } from './types/user.type';

@Injectable() // Регистрируем repository в контейнере NestJS.
export class UsersRepository implements OnModuleInit {
  private readonly collection: Collection<UserDocument>;

  constructor(@Inject(MONGO_DB) database: Db) { // Получаем подключённую MongoDB через DI-токен.
    this.collection = database.collection<UserDocument>('users'); // Используем отдельную коллекцию пользователей.
  }

  async onModuleInit(): Promise<void> { // Создаём необходимые индексы после подключения к MongoDB.
    await this.collection.createIndex(
      { normalized_login: 1 },
      { name: 'users_normalized_login_unique', unique: true },
    ); // Не разрешаем создавать пользователей с одинаковым логином без учёта регистра.
  }

  async create(data: CreateUserData): Promise<UserDocument> { // Сохраняем нового пользователя с временными метками.
    const now = new Date();
    const user: UserDocument = {
      _id: new ObjectId(),
      ...data,
      created_at: now,
      updated_at: now,
    };
    await this.collection.insertOne(user);
    return user;
  }

  findByNormalizedLogin(normalizedLogin: string): Promise<UserDocument | null> { // Ищем пользователя для входа или проверки уникальности.
    return this.collection.findOne({ normalized_login: normalizedLogin });
  }

  findById(id: ObjectId): Promise<UserDocument | null> { // Ищем пользователя по идентификатору для будущего JWT guard.
    return this.collection.findOne({ _id: id });
  }
}
