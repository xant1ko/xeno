import { Module } from '@nestjs/common';
import { OperationsModule } from '../operations/operations.module';
import { CsvImportController } from './csv-import.controller';
import { CsvImportService } from './csv-import.service';

@Module({
  imports: [OperationsModule],
  controllers: [CsvImportController],
  providers: [CsvImportService],
})
export class CsvImportModule {}
