import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { MONGO_DB } from '../database/database.constants';
import { CreateUserData, UserDocument } from './types/user.type';

@Injectable()
export class UsersRepository implements OnModuleInit {
  private readonly collection: Collection<UserDocument>;

  constructor(@Inject(MONGO_DB) database: Db) {
    this.collection = database.collection<UserDocument>('users');
  }

  async onModuleInit(): Promise<void> {
    await this.collection.createIndex(
      { normalized_login: 1 },
      { name: 'users_normalized_login_unique', unique: true },
    );
  }

  async create(data: CreateUserData): Promise<UserDocument> {
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

  findByNormalizedLogin(normalizedLogin: string): Promise<UserDocument | null> {
    return this.collection.findOne({ normalized_login: normalizedLogin });
  }

  findById(id: ObjectId): Promise<UserDocument | null> {
    return this.collection.findOne({ _id: id });
  }
}
