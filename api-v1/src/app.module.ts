import { Module } from '@nestjs/common'; // Импортируем декоратор NestJS-модуля.
import { ConfigModule } from '@nestjs/config'; // Подключаем загрузку переменных окружения.
import { DatabaseModule } from './database/database.module'; // Подключаем единый клиент MongoDB.
import { HealthModule } from './health/health.module'; // Подключаем модуль проверки состояния.

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Делаем конфигурацию доступной во всём приложении.
    DatabaseModule, // Инициализируем MongoDB вместе с API.
    HealthModule, // Регистрируем health-check маршруты.
  ],
})
export class AppModule {} // Объявляем корневой модуль приложения.
