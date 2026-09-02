import { ApiProperty } from '@nestjs/swagger'; // Импортируем описание полей для Swagger.

export class CsvImportErrorDto {
  @ApiProperty({ example: 4, description: 'Номер строки CSV вместе с заголовком.' }) // Документируем номер строки.
  row!: number; // Возвращаем строку с ошибкой.

  @ApiProperty({ example: 'Сумма операции', required: false, description: 'Проблемная колонка.' }) // Документируем колонку ошибки.
  field?: string; // Возвращаем исходное имя поля.

  @ApiProperty({ example: 'abc', required: false, description: 'Проблемное значение.' }) // Документируем значение ошибки.
  value?: string; // Возвращаем значение, которое не удалось обработать.

  @ApiProperty({ example: 'Значение не является числом', description: 'Описание ошибки.' }) // Документируем причину.
  message!: string; // Возвращаем понятное описание ошибки.
}

export class TransactionImportRowDto {
  @ApiProperty({ example: 'дистиляционный куб' }) // Документируем счёт.
  account_name!: string; // Возвращаем название счёта.

  @ApiProperty({ example: '*0330' }) // Документируем карту.
  card_number!: string; // Возвращаем номер карты.

  @ApiProperty({ example: '2026-09-02T10:16:23.000Z', format: 'date-time' }) // Документируем дату.
  date!: Date; // Возвращаем дату операции.

  @ApiProperty({ example: -2000 }) // Документируем сумму.
  transaction_amount!: number; // Возвращаем сумму числом.

  @ApiProperty({ example: 'RUB' }) // Документируем валюту.
  currency!: string; // Возвращаем валюту операции.

  @ApiProperty({ example: 'Ок' }) // Документируем статус.
  status!: string; // Возвращаем статус.

  @ApiProperty({ example: 'Переводы' }) // Документируем банковскую категорию.
  default_category!: string; // Возвращаем категорию по умолчанию.

  @ApiProperty({ example: '', required: false }) // Документируем пользовательскую категорию.
  custom_category!: string; // Возвращаем пользовательскую категорию.

  @ApiProperty({ example: 'Елизавета Б.' }) // Документируем описание.
  description!: string; // Возвращаем описание операции.

  @ApiProperty({ example: '', required: false }) // Документируем сообщение.
  message!: string; // Возвращаем сообщение операции.
}

export class CsvImportResponseDto {
  @ApiProperty({ example: 'operations.csv', description: 'Имя загруженного файла.' }) // Документируем имя файла.
  filename!: string; // Возвращаем исходное имя файла.

  @ApiProperty({ example: 3, description: 'Общее количество строк CSV.' }) // Документируем общее количество.
  total!: number; // Возвращаем число обработанных строк.

  @ApiProperty({ example: 2, description: 'Количество успешно преобразованных строк.' }) // Документируем успехи.
  success!: number; // Возвращаем число успешных строк.

  @ApiProperty({ example: 1, description: 'Количество строк с ошибками.' }) // Документируем ошибки.
  failed!: number; // Возвращаем число неуспешных строк.

  @ApiProperty({ type: [TransactionImportRowDto], description: 'Успешно преобразованные операции.' }) // Документируем успешные записи.
  rows!: TransactionImportRowDto[]; // Возвращаем валидные строки.

  @ApiProperty({ type: [CsvImportErrorDto], description: 'Ошибки отдельных строк.' }) // Документируем ошибки строк.
  errors!: CsvImportErrorDto[]; // Возвращаем ошибки без остановки импорта.
}
