import { Global, Module } from '@nestjs/common'; // Импортируем декораторы глобального модуля.
import { ConfigModule } from '@nestjs/config'; // Даём клиенту доступ к env-конфигурации.
import { MONGO_CLIENT, MONGO_DB } from './database.constants'; // Подключаем DI-токены MongoDB.
import { MongoClientService } from './mongo.client'; // Подключаем сервис единого клиента.

@Global() // Делаем базу доступной всем модулям без повторного импорта.
@Module({
  imports: [ConfigModule], // Используем глобальную конфигурацию приложения.
  providers: [
    MongoClientService, // Регистрируем lifecycle-управление соединением.
    { provide: MONGO_CLIENT, useFactory: (service: MongoClientService) => service.getClient(), inject: [MongoClientService] }, // Экспортируем единый MongoClient.
    { provide: MONGO_DB, useFactory: (service: MongoClientService) => service.getDatabase(), inject: [MongoClientService] }, // Экспортируем рабочую базу.
  ],
  exports: [MongoClientService, MONGO_CLIENT, MONGO_DB], // Разрешаем repositories получать клиент или базу.
})
export class DatabaseModule {} // Объявляем модуль подключения MongoDB.
