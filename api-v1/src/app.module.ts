import { Module } from '@nestjs/common'; // Импортируем декоратор NestJS-модуля.
import { ConfigModule } from '@nestjs/config'; // Подключаем загрузку переменных окружения.
import { HealthModule } from './health/health.module'; // Подключаем модуль проверки состояния.

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Делаем конфигурацию доступной во всём приложении.
    HealthModule, // Регистрируем health-check маршруты.
  ],
})
export class AppModule {} // Объявляем корневой модуль приложения.
