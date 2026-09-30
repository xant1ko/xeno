import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { MONGO_DB } from '../database/database.constants';
import { CategoryDocument } from './types/category.type';

@Injectable()
export class CategoriesRepository implements OnModuleInit {
  private readonly collection: Collection<CategoryDocument>;

  constructor(@Inject(MONGO_DB) database: Db) {
    this.collection = database.collection<CategoryDocument>('categories');
  }

  async onModuleInit(): Promise<void> {
    await this.collection.createIndex(
      { user_id: 1, name: 1 },
      { name: 'categories_user_id_name_unique', unique: true },
    );
  }

  async replaceForUser(userId: ObjectId, names: string[]): Promise<void> {
    const now = new Date();

    // Удаляем категории, которых больше нет среди операций, а оставшиеся создаём или обновляем.
    await this.collection.deleteMany({ user_id: userId, name: { $nin: names } });
    if (names.length === 0) {
      return;
    }

    await this.collection.bulkWrite(
      names.map(name => ({
        updateOne: {
          filter: { user_id: userId, name },
          update: {
            $set: { updated_at: now },
            $setOnInsert: { _id: new ObjectId(), user_id: userId, name, created_at: now },
          },
          upsert: true,
        },
      })),
    );
  }

  async create(userId: ObjectId, name: string): Promise<CategoryDocument> {
    const now = new Date();
    const category: CategoryDocument = {
      _id: new ObjectId(),
      user_id: userId,
      name,
      created_at: now,
      updated_at: now,
    };
    await this.collection.insertOne(category);
    return category;
  }

  findAll(userId: ObjectId): Promise<CategoryDocument[]> {
    return this.collection.find({ user_id: userId }).sort({ name: 1, _id: 1 }).toArray();
  }

  findById(userId: ObjectId, id: ObjectId): Promise<CategoryDocument | null> {
    return this.collection.findOne({ _id: id, user_id: userId });
  }

  updateById(userId: ObjectId, id: ObjectId, name: string): Promise<CategoryDocument | null> {
    return this.collection.findOneAndUpdate(
      { _id: id, user_id: userId },
      { $set: { name, updated_at: new Date() } },
      { returnDocument: 'after' },
    );
  }

  async deleteById(userId: ObjectId, id: ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id, user_id: userId });
    return result.deletedCount === 1;
  }
}
