import { Controller, Get } from '@nestjs/common'; // Импортируем декораторы HTTP-контроллера.
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'; // Импортируем декораторы описания endpoint в Swagger.
import { MongoClientService } from '../database/mongo.client'; // Подключаем проверку соединения с MongoDB.
import { HealthResponseDto } from './dto/health-response.dto'; // Подключаем схему ответа health-check.

@ApiTags('health') // Объединяем health-check маршруты в отдельный раздел Swagger.
@Controller('health') // Формируем маршрут /api/v1/health с учётом глобального префикса.
export class HealthController {
  constructor(private readonly mongoClient: MongoClientService) {} // Получаем единый MongoDB-клиент через DI.

  @Get() // Обрабатываем GET-запрос к health-check маршруту.
  @ApiOperation({ summary: 'Проверить состояние API' }) // Показываем назначение ручки в Swagger UI.
  @ApiOkResponse({ type: HealthResponseDto, description: 'Сервис работает.' }) // Описываем схему успешного ответа.
  async getStatus(): Promise<HealthResponseDto> { // Возвращаем состояние API и MongoDB.
    await this.mongoClient.ping(); // Проверяем, что база отвечает в момент запроса.
    return {
      status: 'ok', // Показываем, что сервис доступен.
      service: 'api-v1', // Указываем имя текущего сервиса.
      timestamp: new Date().toISOString(), // Добавляем время формирования ответа.
      database: 'ok', // Показываем успешную проверку MongoDB.
    };
  }
}
