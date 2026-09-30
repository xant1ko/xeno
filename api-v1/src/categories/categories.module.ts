import { Module } from '@nestjs/common';
import { OperationsModule } from '../operations/operations.module';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

@Module({
  imports: [OperationsModule],
  controllers: [CategoriesController],
  providers: [CategoriesRepository, CategoriesService],
})
export class CategoriesModule {}
