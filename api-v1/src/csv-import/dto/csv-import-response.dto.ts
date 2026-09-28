import { ApiProperty } from '@nestjs/swagger';
import { CreateManyOperationsResponseDto } from '../../operations/dto/create-many-response.dto';

export class CsvImportErrorDto {
  @ApiProperty({ example: 4, description: 'Номер строки CSV вместе с заголовком.' })
  row!: number;

  @ApiProperty({ example: 'Сумма операции', required: false, description: 'Проблемная колонка.' })
  field?: string;

  @ApiProperty({ example: 'abc', required: false, description: 'Проблемное значение.' })
  value?: string;

  @ApiProperty({ example: 'Значение не является числом', description: 'Описание ошибки.' })
  message!: string;
}

export class TransactionImportRowDto {
  @ApiProperty({ example: 'дистиляционный куб' })
  account_name!: string;

  @ApiProperty({ example: '*0330' })
  card_number!: string;

  @ApiProperty({ example: '2026-09-02T10:16:23.000Z', format: 'date-time' })
  date!: Date;

  @ApiProperty({ example: -2000 })
  transaction_amount!: number;

  @ApiProperty({ example: 'RUB' })
  currency!: string;

  @ApiProperty({ example: 'Ок' })
  status!: string;

  @ApiProperty({ example: 'Переводы' })
  default_category!: string;

  @ApiProperty({ example: '', required: false })
  custom_category!: string;

  @ApiProperty({ example: 'Елизавета Б.' })
  description!: string;

  @ApiProperty({ example: '', required: false })
  message!: string;
}

export class CsvImportResponseDto {
  @ApiProperty({ example: 'operations.csv', description: 'Имя загруженного файла.' })
  filename!: string;

  @ApiProperty({ example: 3, description: 'Общее количество строк CSV.' })
  total!: number;

  @ApiProperty({ example: 2, description: 'Количество успешно преобразованных строк.' })
  success!: number;

  @ApiProperty({ example: 1, description: 'Количество строк с ошибками.' })
  failed!: number;

  @ApiProperty({ type: [TransactionImportRowDto], description: 'Успешно преобразованные операции.' })
  rows!: TransactionImportRowDto[];

  @ApiProperty({ type: [CsvImportErrorDto], description: 'Ошибки отдельных строк.' })
  errors!: CsvImportErrorDto[];

  @ApiProperty({ type: CreateManyOperationsResponseDto, description: 'Результат сохранения корректных операций в MongoDB.' })
  saved!: CreateManyOperationsResponseDto;
}
