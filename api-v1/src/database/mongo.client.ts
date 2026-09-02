import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'; // Импортируем lifecycle-хуки NestJS и логгер.
import { ConfigService } from '@nestjs/config'; // Получаем настройки MongoDB из окружения.
import { Db, MongoClient } from 'mongodb'; // Используем официальный MongoDB-клиент и тип базы.

@Injectable() // Регистрируем сервис в контейнере зависимостей NestJS.
export class MongoClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MongoClientService.name); // Создаём отдельный логгер подключения.
  private readonly client: MongoClient; // Храним один клиент на весь жизненный цикл API.
  private readonly databaseName: string; // Запоминаем имя рабочей базы данных.

  constructor(private readonly configService: ConfigService) { // Получаем глобальный ConfigService.
    const uri = this.configService.getOrThrow<string>('MONGO_URI'); // Читаем обязательный URI MongoDB.
    this.databaseName = this.configService.getOrThrow<string>('MONGO_DATABASE'); // Читаем обязательное имя базы.
    const username = this.configService.getOrThrow<string>('MONGO_USERNAME'); // Читаем логин из окружения.
    const password = this.configService.getOrThrow<string>('MONGO_PASSWORD'); // Читаем пароль из окружения.
    const authSource = this.configService.get<string>('MONGO_AUTH_SOURCE', 'admin'); // Используем admin для root-пользователя.

    this.client = new MongoClient(uri, { // Создаём единый клиент с настройками авторизации.
      auth: { username, password }, // Передаём секреты только через env.
      authSource, // Указываем базу, где создан пользователь.
    });
  }

  async onModuleInit(): Promise<void> { // Подключаемся при старте NestJS.
    await this.client.connect(); // Открываем соединение с MongoDB.
    await this.client.db(this.databaseName).command({ ping: 1 }); // Проверяем, что база отвечает.
    this.logger.log(`MongoDB connected to database "${this.databaseName}"`); // Записываем успешное подключение.
  }

  async onModuleDestroy(): Promise<void> { // Закрываем соединение при остановке API.
    await this.client.close(); // Освобождаем ресурсы MongoDB-клиента.
    this.logger.log('MongoDB connection closed'); // Записываем корректное завершение.
  }

  getClient(): MongoClient { // Возвращаем единый клиент для специальных операций.
    return this.client; // Не создаём новый MongoClient на каждый вызов.
  }

  getDatabase(): Db { // Возвращаем рабочую базу для repository-слоя.
    return this.client.db(this.databaseName); // Получаем Db из уже созданного клиента.
  }

  async ping(): Promise<void> { // Проверяем доступность MongoDB для health-check.
    await this.getDatabase().command({ ping: 1 }); // Отправляем лёгкую команду без изменения данных.
  }
}
