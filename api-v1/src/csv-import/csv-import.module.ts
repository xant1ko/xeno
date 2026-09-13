import { Module } from '@nestjs/common'; // Импортируем декоратор NestJS-модуля.
import { OperationsModule } from '../operations/operations.module';
import { CsvImportController } from './csv-import.controller'; // Подключаем HTTP-контроллер импорта.
import { CsvImportService } from './csv-import.service'; // Подключаем сервис парсинга CSV.

@Module({
  imports: [OperationsModule],
  controllers: [CsvImportController], // Регистрируем endpoint загрузки файла.
  providers: [CsvImportService], // Регистрируем сервис обработки CSV.
})
export class CsvImportModule {} // Объявляем модуль импорта CSV.
