import { BadRequestException, Controller, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common'; // Импортируем HTTP-декораторы и проверку файла.
import { FileInterceptor } from '@nestjs/platform-express'; // Подключаем обработку multipart-файлов через Multer.
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'; // Импортируем Swagger-декораторы.
import { CsvImportResponseDto } from './dto/csv-import-response.dto'; // Подключаем схему JSON-ответа.
import { CsvImportResult } from './types/csv-row.type'; // Подключаем результат частичного импорта.
import { CsvImportService } from './csv-import.service'; // Подключаем сервис парсинга CSV.

@ApiTags('csv-import') // Объединяем endpoint импорта в Swagger-раздел.
@Controller('csv-import') // Формируем маршрут /api/v1/csv-import.
export class CsvImportController {
  constructor(private readonly csvImportService: CsvImportService) {} // Получаем сервис обработки CSV через DI.

  @Post() // Обрабатываем POST-запрос загрузки файла.
  @UseInterceptors(FileInterceptor('file')) // Извлекаем файл из поля multipart с именем file.
  @ApiOperation({ summary: 'Распарсить CSV-файл' }) // Описываем назначение endpoint в Swagger.
  @ApiConsumes('multipart/form-data') // Указываем Swagger тип входящего запроса.
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'CSV-файл размером до 5 MB.' },
      },
      required: ['file'],
    },
  }) // Описываем multipart-поле загрузки файла.
  @ApiResponse({ status: 201, type: CsvImportResponseDto, description: 'CSV успешно преобразован в JSON.' }) // Описываем успешный ответ.
  @ApiResponse({ status: 400, description: 'Файл отсутствует или имеет некорректный CSV-формат.' }) // Описываем ошибки валидации.
  @ApiResponse({ status: 413, description: 'Файл превышает ограничение размера.' }) // Документируем ограничение размера.
  parseCsv(
    @UploadedFile(new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })], // Ограничиваем файл пятью мегабайтами.
      fileIsRequired: true, // Требуем обязательное поле file.
      exceptionFactory: () => new BadRequestException('CSV-файл не передан'), // Возвращаем понятную ошибку без файла.
    })) file: Express.Multer.File, // Получаем загруженный файл в памяти.
  ): CsvImportResponseDto { // Возвращаем частичный результат парсинга в JSON.
    const result: CsvImportResult = this.csvImportService.parseFile(file); // Преобразуем CSV и собираем ошибки строк.
    return {
      filename: file.originalname, // Возвращаем имя исходного файла.
      total: result.rows.length + result.errors.length, // Считаем все обработанные строки.
      success: result.rows.length, // Считаем успешные строки.
      failed: result.errors.length, // Считаем строки с ошибками.
      rows: result.rows, // Возвращаем валидные операции.
      errors: result.errors, // Возвращаем ошибки отдельных строк.
    }; // Формируем ответ с HTTP-статусом 201.
  }
}
