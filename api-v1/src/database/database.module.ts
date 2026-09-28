import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MONGO_CLIENT, MONGO_DB } from './database.constants';
import { MongoClientService } from './mongo.client';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    MongoClientService,
    { provide: MONGO_CLIENT, useFactory: (service: MongoClientService) => service.getClient(), inject: [MongoClientService] },
    { provide: MONGO_DB, useFactory: (service: MongoClientService) => service.getDatabase(), inject: [MongoClientService] },
  ],
  exports: [MongoClientService, MONGO_CLIENT, MONGO_DB],
})
export class DatabaseModule {}
