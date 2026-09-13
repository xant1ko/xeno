import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOperationDto {
  @ApiProperty({ example: 'Основной счёт' })
  @IsString()
  @IsNotEmpty()
  account_name!: string;

  @ApiProperty({ example: '*0330' })
  @IsString()
  card_number!: string;

  @ApiProperty({ example: '2026-09-13T03:16:23.000Z', format: 'date-time' })
  @IsISO8601({ strict: true })
  date!: string;

  @ApiProperty({ example: -2000 })
  @IsNumber({ allowInfinity: false, allowNaN: false })
  transaction_amount!: number;

  @ApiProperty({ example: 'RUB' })
  @IsString()
  @IsNotEmpty()
  currency!: string;

  @ApiProperty({ example: 'Ок' })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiProperty({ example: 'Переводы' })
  @IsString()
  @IsNotEmpty()
  default_category!: string;

  @ApiProperty({ example: '' })
  @IsString()
  custom_category!: string;

  @ApiProperty({ example: 'Елизавета Б.' })
  @IsString()
  description!: string;

  @ApiProperty({ example: '' })
  @IsString()
  message!: string;
}
