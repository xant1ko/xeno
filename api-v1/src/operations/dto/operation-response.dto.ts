import { ApiProperty } from '@nestjs/swagger';

export class OperationResponseDto {
  @ApiProperty({ example: '66e4fa78469290f19f5642b1' })
  id!: string;

  @ApiProperty({ example: 'Основной счёт' })
  account_name!: string;

  @ApiProperty({ example: '*0330' })
  card_number!: string;

  @ApiProperty({ example: '2026-09-13T03:16:23.000Z', format: 'date-time' })
  date!: Date;

  @ApiProperty({ example: -2000 })
  transaction_amount!: number;

  @ApiProperty({ example: 'RUB' })
  currency!: string;

  @ApiProperty({ example: 'Ок' })
  status!: string;

  @ApiProperty({ example: 'Переводы' })
  default_category!: string;

  @ApiProperty({ example: '' })
  custom_category!: string;

  @ApiProperty({ example: 'Елизавета Б.' })
  description!: string;

  @ApiProperty({ example: '' })
  message!: string;

  @ApiProperty({ example: '2026-09-13T03:17:00.000Z', format: 'date-time' })
  created_at!: Date;

  @ApiProperty({ example: '2026-09-13T03:17:00.000Z', format: 'date-time' })
  updated_at!: Date;
}

export class OperationsPageResponseDto {
  @ApiProperty({ type: [OperationResponseDto] })
  items!: OperationResponseDto[];

  @ApiProperty({ example: 125 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 50 })
  limit!: number;
}
