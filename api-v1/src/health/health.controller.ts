import { Controller, Get } from '@nestjs/common'; // Импортируем декораторы HTTP-контроллера.

@Controller('health') // Формируем маршрут /api/v1/health с учётом глобального префикса.
export class HealthController {
  @Get() // Обрабатываем GET-запрос к health-check маршруту.
  getStatus() { // Возвращаем текущее состояние API.
    return {
      status: 'ok', // Показываем, что сервис доступен.
      service: 'api-v1', // Указываем имя текущего сервиса.
      timestamp: new Date().toISOString(), // Добавляем время формирования ответа.
    };
  }
}
