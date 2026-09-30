import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CsvImportModule } from './csv-import/csv-import.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { OperationsModule } from './operations/operations.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CategoriesModule,
    CsvImportModule,
    DatabaseModule,
    HealthModule,
    OperationsModule,
    UsersModule,
  ],
})
export class AppModule {}
