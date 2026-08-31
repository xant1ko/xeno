import { Module } from '@nestjs/common'; // Импортируем декоратор для объявления модуля.
import { HealthController } from './health.controller'; // Подключаем контроллер health-check.

@Module({
  controllers: [HealthController], // Регистрируем HTTP-маршруты состояния сервиса.
})
export class HealthModule {} // Объявляем отдельный модуль проверки состояния.
