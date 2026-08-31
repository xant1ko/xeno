import { ValidationPipe } from '@nestjs/common'; // Подключаем глобальную проверку входных данных.
import { ConfigService } from '@nestjs/config'; // Получаем настройки приложения из окружения.
import { NestFactory } from '@nestjs/core'; // Создаём экземпляр NestJS-приложения.
import { AppModule } from './app.module'; // Подключаем корневой модуль приложения.

async function bootstrap(): Promise<void> { // Описываем асинхронный запуск сервера.
  const app = await NestFactory.create(AppModule); // Инициализируем HTTP-приложение.
  const configService = app.get(ConfigService); // Получаем сервис конфигурации из DI-контейнера.

  app.setGlobalPrefix('api/v1'); // Добавляем единую версию ко всем API-маршрутам.
  app.enableCors(); // Разрешаем запросы с других источников.
  app.useGlobalPipes( // Устанавливаем общую обработку DTO-валидации.
    new ValidationPipe({
      whitelist: true, // Удаляем поля, которых нет в DTO.
      transform: true, // Преобразуем входные значения к типам DTO.
      forbidNonWhitelisted: true, // Отклоняем запросы с неизвестными полями.
    }),
  );

  const port = configService.get<number>('PORT', 3000); // Берём порт из окружения или используем 3000.
  await app.listen(port); // Запускаем сервер на выбранном порту.
}

void bootstrap(); // Запускаем приложение без необработанного Promise.
