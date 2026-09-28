import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';

@Injectable()
export class MongoClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoClientService.name);
  private readonly client: MongoClient;
  private readonly databaseName: string;

  constructor(private readonly configService: ConfigService) {
    const uri = this.configService.getOrThrow<string>('MONGO_URI');
    this.databaseName = this.configService.getOrThrow<string>('MONGO_DATABASE');
    const username = this.configService.getOrThrow<string>('MONGO_USERNAME');
    const password = this.configService.getOrThrow<string>('MONGO_PASSWORD');
    const authSource = this.configService.get<string>('MONGO_AUTH_SOURCE', 'admin');

    this.client = new MongoClient(uri, {
      auth: { username, password },
      authSource,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
    await this.client.db(this.databaseName).command({ ping: 1 });
    this.logger.log(`MongoDB connected to database "${this.databaseName}"`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
    this.logger.log('MongoDB connection closed');
  }

  getClient(): MongoClient {
    return this.client;
  }

  getDatabase(): Db {
    return this.client.db(this.databaseName);
  }

  async ping(): Promise<void> {
    await this.getDatabase().command({ ping: 1 });
  }
}
