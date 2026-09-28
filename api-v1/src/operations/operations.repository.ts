import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Collection, Db, ObjectId } from 'mongodb';
import { MONGO_DB } from '../database/database.constants';
import { OperationDocument, OperationFields, OperationsPage } from './types/operation.type';

@Injectable()
export class OperationsRepository implements OnModuleInit {
  private readonly collection: Collection<OperationDocument>;

  constructor(@Inject(MONGO_DB) database: Db) {
    this.collection = database.collection<OperationDocument>('operations');
  }

  async onModuleInit(): Promise<void> {
    await this.collection.createIndex(
      { user_id: 1, date: -1 },
      { name: 'operations_user_id_date_desc' },
    );
  }

  async create(userId: ObjectId, fields: OperationFields): Promise<OperationDocument> {
    const now = new Date();
    const document: OperationDocument = {
      _id: new ObjectId(),
      user_id: userId,
      ...fields,
      created_at: now,
      updated_at: now,
    };
    await this.collection.insertOne(document);
    return document;
  }

  async createMany(userId: ObjectId, fieldsList: OperationFields[]): Promise<OperationDocument[]> {
    if (fieldsList.length === 0) {
      return [];
    }

    const now = new Date();
    const documents = fieldsList.map(fields => ({
      _id: new ObjectId(),
      user_id: userId,
      ...fields,
      created_at: now,
      updated_at: now,
    }));
    await this.collection.insertMany(documents);
    return documents;
  }

  async findLatestDate(userId: ObjectId): Promise<Date | null> {
    const latest = await this.collection.findOne({ user_id: userId }, { sort: { date: -1 }, projection: { date: 1 } });
    return latest?.date ?? null;
  }

  async findAll(userId: ObjectId, page: number, limit: number): Promise<OperationsPage> {
    const [items, total] = await Promise.all([
      this.collection
        .find({ user_id: userId })
        .sort({ date: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      this.collection.countDocuments({ user_id: userId }),
    ]);
    return { items, total };
  }

  findById(userId: ObjectId, id: ObjectId): Promise<OperationDocument | null> {
    return this.collection.findOne({ _id: id, user_id: userId });
  }

  async updateById(userId: ObjectId, id: ObjectId, fields: Partial<OperationFields>): Promise<OperationDocument | null> {
    return this.collection.findOneAndUpdate(
      { _id: id, user_id: userId },
      { $set: { ...fields, updated_at: new Date() } },
      { returnDocument: 'after' },
    );
  }

  async deleteById(userId: ObjectId, id: ObjectId): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: id, user_id: userId });
    return result.deletedCount === 1;
  }
}
