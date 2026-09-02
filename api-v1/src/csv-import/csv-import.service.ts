import { BadRequestException, Injectable } from '@nestjs/common'; // Импортируем HTTP-ошибку и DI-декоратор.
import { parse } from 'csv-parse/sync'; // Используем синхронный parser для загруженного буфера.
import { CsvImportError, CsvImportResult, CsvRow, TransactionImportRow } from './types/csv-row.type'; // Подключаем типы импорта.

// Описываем обязательные заголовки банковского CSV.
const requiredColumns = [
  'Имя счёта',
  'Номер карты',
  'Дата операции',
  'Сумма операции',
  'Валюта операции',
  'Статус',
  'Категория по-умолчанию',
  'Ваша категория',
  'Описание',
  'Сообщение',
] as const;

// Позволяем передавать ошибку преобразования с конкретным полем.
class CsvRowError extends Error {
  constructor(
    public readonly field: string,
    public readonly value: string,
    message: string,
  ) {
    super(message); // Передаём описание базовому классу Error.
  }
}

@Injectable() // Регистрируем сервис в контейнере NestJS.
export class CsvImportService {
  parseFile(file: Express.Multer.File): CsvImportResult { // Преобразуем CSV в успешные строки и ошибки.
    if (!file.originalname.toLowerCase().endsWith('.csv')) { // Проверяем расширение загруженного файла.
      throw new BadRequestException('Ожидается файл с расширением .csv'); // Отклоняем неподдерживаемый формат.
    }
    if (!file.buffer.length) { // Проверяем, что файл не пустой.
      throw new BadRequestException('CSV-файл пустой'); // Возвращаем понятную ошибку клиенту.
    }

    let records: CsvRow[]; // Подготавливаем массив сырых строк.
    try {
      records = parse(file.buffer.toString('utf8'), { // Декодируем файл и запускаем parser.
        bom: true, // Убираем UTF-8 BOM, если он присутствует.
        columns: true, // Используем первую строку как имена полей.
        delimiter: ';', // Используем точку с запятой как разделитель.
        skip_empty_lines: true, // Не создаём записи из пустых строк.
        trim: true, // Убираем пробелы вокруг значений.
      }) as CsvRow[]; // Приводим результат parser-а к типу сырых строк.
    } catch (error) {
      const message = error instanceof Error ? error.message : 'неизвестная ошибка'; // Получаем безопасное описание parser-ошибки.
      throw new BadRequestException(`Некорректный CSV-файл: ${message}`); // Ошибка структуры файла остаётся общей для всего файла.
    }

    const headers = records.length > 0 ? Object.keys(records[0]) : []; // Получаем заголовки из первой записи.
    const missingColumn = requiredColumns.find(column => !headers.includes(column)); // Ищем отсутствующий обязательный заголовок.
    if (missingColumn) { // Проверяем результат поиска заголовка.
      throw new BadRequestException(`В CSV отсутствует обязательная колонка: ${missingColumn}`); // Без заголовка строки нельзя преобразовать.
    }

    const rows: TransactionImportRow[] = []; // Собираем успешно преобразованные строки.
    const errors: CsvImportError[] = []; // Собираем ошибки и продолжаем обработку файла.
    records.forEach((record, index) => { // Обрабатываем каждую строку независимо.
      const rowNumber = index + 2; // Учитываем строку заголовков при нумерации.
      try {
        rows.push(this.transformRow(record)); // Добавляем только валидную преобразованную строку.
      } catch (error) {
        errors.push(this.toImportError(error, rowNumber)); // Сохраняем ошибку и не прерываем импорт.
      }
    });

    return { rows, errors }; // Возвращаем частичный результат обработки.
  }

  private transformRow(row: CsvRow): TransactionImportRow { // Преобразуем одну банковскую строку.
    return {
      account_name: this.requiredString(row['Имя счёта'], 'Имя счёта'), // Переименовываем имя счёта.
      card_number: this.normalizeString(row['Номер карты']), // Сохраняем номер карты и допускаем пустое значение.
      date: this.parseDate(row['Дата операции'], 'Дата операции'), // Преобразуем дату в Date.
      transaction_amount: this.parseAmount(row['Сумма операции'], 'Сумма операции'), // Преобразуем сумму с запятой.
      currency: this.requiredString(row['Валюта операции'], 'Валюта операции').toUpperCase(), // Нормализуем валюту.
      status: this.requiredString(row['Статус'], 'Статус'), // Переносим статус операции.
      default_category: this.requiredString(row['Категория по-умолчанию'], 'Категория по-умолчанию'), // Переносим категорию банка.
      custom_category: this.normalizeString(row['Ваша категория']), // Пустую категорию оставляем пустой строкой.
      description: this.normalizeString(row['Описание']), // Переносим описание операции.
      message: this.normalizeString(row['Сообщение']), // Переносим сообщение операции.
    }; // Возвращаем целевую модель операции.
  }

  private requiredString(value: string | undefined, field: string): string { // Проверяем обязательное текстовое поле.
    const normalized = this.normalizeString(value); // Нормализуем входное значение.
    if (!normalized) { // Проверяем, что поле заполнено.
      throw new CsvRowError(field, normalized, 'Поле обязательно для заполнения'); // Формируем ошибку конкретной строки.
    }
    return normalized; // Возвращаем очищенную строку.
  }

  private normalizeString(value: string | undefined): string { // Унифицируем обработку строковых значений.
    return value?.trim() ?? ''; // Убираем пробелы и заменяем отсутствие значения на пустую строку.
  }

  private parseAmount(value: string | undefined, field: string): number { // Преобразуем сумму с русским десятичным разделителем.
    const normalized = this.normalizeString(value).replace(',', '.'); // Заменяем десятичную запятую на точку.
    const amount = Number(normalized); // Преобразуем строку в число.
    if (!normalized || !Number.isFinite(amount)) { // Проверяем корректность результата.
      throw new CsvRowError(field, normalized, 'Значение не является числом'); // Возвращаем ошибку с исходным значением.
    }
    return amount; // Возвращаем числовую сумму.
  }

  private parseDate(value: string | undefined, field: string): Date { // Преобразуем дату DD.MM.YYYY HH:mm:ss.
    const normalized = this.normalizeString(value); // Убираем лишние пробелы вокруг даты.
    const match = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(normalized); // Проверяем строгий формат даты.
    if (!match) { // Обрабатываем неверный формат даты.
      throw new CsvRowError(field, normalized, 'Ожидается формат DD.MM.YYYY HH:mm:ss'); // Возвращаем понятную ошибку.
    }
    const [, day, month, year, hours, minutes, seconds] = match; // Извлекаем компоненты даты.
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds)); // Создаём локальную дату.
    if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) { // Проверяем существование даты.
      throw new CsvRowError(field, normalized, 'Дата не существует'); // Отклоняем, например, 31.02.2026.
    }
    return date; // Возвращаем валидную дату.
  }

  private toImportError(error: unknown, row: number): CsvImportError { // Преобразуем исключение в JSON-ошибку строки.
    if (error instanceof CsvRowError) { // Проверяем нашу структурированную ошибку.
      return { row, field: error.field, value: error.value, message: error.message }; // Возвращаем поле и значение.
    }
    return { row, message: error instanceof Error ? error.message : 'Ошибка преобразования строки' }; // Обрабатываем неожиданные ошибки безопасно.
  }
}
