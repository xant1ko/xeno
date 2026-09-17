import { ValidationPipe } from '@nestjs/common'; // Подключаем глобальную проверку входных данных.
import { ConfigService } from '@nestjs/config'; // Получаем настройки приложения из окружения.
import { NestFactory } from '@nestjs/core'; // Создаём экземпляр NestJS-приложения.
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // Подключаем генератор OpenAPI-документации.
import { AppModule } from './app.module'; // Подключаем корневой модуль приложения.

async function bootstrap(): Promise<void> { // Описываем асинхронный запуск сервера.
  const app = await NestFactory.create(AppModule); // Инициализируем HTTP-приложение.
  const configService = app.get(ConfigService); // Получаем сервис конфигурации из DI-контейнера.

  app.setGlobalPrefix('api/v1'); // Добавляем единую версию ко всем API-маршрутам.
  app.enableCors(); // Разрешаем запросы с других источников.

  const swaggerConfig = new DocumentBuilder() // Начинаем описывать метаданные API.
    .setTitle('api-v1') // Задаём название документации.
    .setDescription('Документация API сервиса api-v1.') // Добавляем краткое описание сервиса.
    .setVersion('1.0') // Фиксируем текущую версию OpenAPI-контракта.
    .addBearerAuth() // Резервируем схему авторизации для будущих защищённых ручек.
    .build(); // Собираем конфигурацию Swagger.
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig); // Генерируем OpenAPI-схему из контроллеров и DTO.
  SwaggerModule.setup('api/v1/docs', app, swaggerDocument); // Публикуем Swagger UI по адресу /api/v1/docs.
  app.useGlobalPipes( // Устанавливаем общую обработку DTO-валидации.
    new ValidationPipe({
      whitelist: true, // Удаляем поля, которых нет в DTO.
      transform: true, // Преобразуем входные значения к типам DTO.
      forbidNonWhitelisted: true, // Отклоняем запросы с неизвестными полями.
    }),
  );

  const port = configService.get<number>('PORT', 8000); // Берём порт из окружения или используем 8000.
  await app.listen(port, '0.0.0.0'); // Принимаем запросы из Docker-сети и с локального хоста.
}

void bootstrap(); // Запускаем приложение без необработанного Promise.
