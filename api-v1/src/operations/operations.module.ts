import { Module } from '@nestjs/common';
import { OperationsController } from './operations.controller';
import { OperationsRepository } from './operations.repository';
import { OperationsService } from './operations.service';

@Module({
  controllers: [OperationsController],
  providers: [OperationsRepository, OperationsService],
  exports: [OperationsRepository, OperationsService],
})
export class OperationsModule {}
