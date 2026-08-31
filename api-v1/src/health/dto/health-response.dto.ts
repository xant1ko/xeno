import { ApiProperty } from '@nestjs/swagger'; // Импортируем описание поля для Swagger-схемы.

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Текущее состояние сервиса.' }) // Документируем статус ответа.
  status!: string; // Храним состояние health-check.

  @ApiProperty({ example: 'api-v1', description: 'Имя сервиса.' }) // Документируем идентификатор сервиса.
  service!: string; // Храним имя текущего API.

  @ApiProperty({ example: '2026-08-31T15:00:00.000Z', description: 'Время формирования ответа в ISO 8601.' }) // Документируем формат времени.
  timestamp!: string; // Храним время проверки.
}
