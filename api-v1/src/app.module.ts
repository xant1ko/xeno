import { Module } from '@nestjs/common'; // Импортируем декоратор NestJS-модуля.
import { ConfigModule } from '@nestjs/config'; // Подключаем загрузку переменных окружения.
import { AuthModule } from './auth/auth.module';
import { CsvImportModule } from './csv-import/csv-import.module'; // Подключаем модуль импорта CSV.
import { DatabaseModule } from './database/database.module'; // Подключаем единый клиент MongoDB.
import { HealthModule } from './health/health.module'; // Подключаем модуль проверки состояния.
import { OperationsModule } from './operations/operations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Делаем конфигурацию доступной во всём приложении.
    AuthModule, // Регистрируем ручки регистрации, входа и проверки JWT.
    CsvImportModule, // Регистрируем endpoint преобразования CSV в JSON.
    DatabaseModule, // Инициализируем MongoDB вместе с API.
    HealthModule, // Регистрируем health-check маршруты.
    OperationsModule,
    UsersModule, // Подготавливаем хранение пользователей для будущей авторизации.
  ],
})
export class AppModule {} // Объявляем корневой модуль приложения.
