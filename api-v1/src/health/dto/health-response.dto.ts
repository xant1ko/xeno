import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Текущее состояние сервиса.' })
  status!: string;

  @ApiProperty({ example: 'api-v1', description: 'Имя сервиса.' })
  service!: string;

  @ApiProperty({ example: '2026-08-31T15:00:00.000Z', description: 'Время формирования ответа в ISO 8601.' })
  timestamp!: string;

  @ApiProperty({ example: 'ok', description: 'Состояние подключения к MongoDB.' })
  database!: string;
}
