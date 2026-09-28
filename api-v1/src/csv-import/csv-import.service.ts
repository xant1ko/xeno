import { BadRequestException, Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { CsvImportError, CsvImportResult, CsvRow, TransactionImportRow } from './types/csv-row.type';
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
class CsvRowError extends Error {
  constructor(
    public readonly field: string,
    public readonly value: string,
    message: string,
  ) {
    super(message);
  }
}

@Injectable()
export class CsvImportService {
  parseFile(file: Express.Multer.File): CsvImportResult {
    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('Ожидается файл с расширением .csv');
    }
    if (!file.buffer.length) {
      throw new BadRequestException('CSV-файл пустой');
    }

    let records: CsvRow[];
    try {
      records = parse(file.buffer.toString('utf8'), {
        bom: true,
        columns: true,
        delimiter: ';',
        skip_empty_lines: true,
        trim: true,
      }) as CsvRow[];
    } catch (error) {
      const message = error instanceof Error ? error.message : 'неизвестная ошибка';
      throw new BadRequestException(`Некорректный CSV-файл: ${message}`);
    }

    const headers = records.length > 0 ? Object.keys(records[0]) : [];
    const missingColumn = requiredColumns.find(column => !headers.includes(column));
    if (missingColumn) {
      throw new BadRequestException(`В CSV отсутствует обязательная колонка: ${missingColumn}`);
    }

    const rows: TransactionImportRow[] = [];
    const errors: CsvImportError[] = [];
    records.forEach((record, index) => {
      const rowNumber = index + 2;
      try {
        rows.push(this.transformRow(record));
      } catch (error) {
        errors.push(this.toImportError(error, rowNumber));
      }
    });

    return { rows, errors };
  }

  private transformRow(row: CsvRow): TransactionImportRow {
    return {
      account_name: this.requiredString(row['Имя счёта'], 'Имя счёта'),
      card_number: this.normalizeString(row['Номер карты']),
      date: this.parseDate(row['Дата операции'], 'Дата операции'),
      transaction_amount: this.parseAmount(row['Сумма операции'], 'Сумма операции'),
      currency: this.requiredString(row['Валюта операции'], 'Валюта операции').toUpperCase(),
      status: this.requiredString(row['Статус'], 'Статус'),
      default_category: this.requiredString(row['Категория по-умолчанию'], 'Категория по-умолчанию'),
      custom_category: this.normalizeString(row['Ваша категория']),
      description: this.normalizeString(row['Описание']),
      message: this.normalizeString(row['Сообщение']),
    };
  }

  private requiredString(value: string | undefined, field: string): string {
    const normalized = this.normalizeString(value);
    if (!normalized) {
      throw new CsvRowError(field, normalized, 'Поле обязательно для заполнения');
    }
    return normalized;
  }

  private normalizeString(value: string | undefined): string {
    return value?.trim() ?? '';
  }

  private parseAmount(value: string | undefined, field: string): number {
    const normalized = this.normalizeString(value).replace(',', '.');
    const amount = Number(normalized);
    if (!normalized || !Number.isFinite(amount)) {
      throw new CsvRowError(field, normalized, 'Значение не является числом');
    }
    return amount;
  }

  private parseDate(value: string | undefined, field: string): Date {
    const normalized = this.normalizeString(value);
    const match = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(normalized);
    if (!match) {
      throw new CsvRowError(field, normalized, 'Ожидается формат DD.MM.YYYY HH:mm:ss');
    }
    const [, day, month, year, hours, minutes, seconds] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
    if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) {
      throw new CsvRowError(field, normalized, 'Дата не существует');
    }
    return date;
  }

  private toImportError(error: unknown, row: number): CsvImportError {
    if (error instanceof CsvRowError) {
      return { row, field: error.field, value: error.value, message: error.message };
    }
    return { row, message: error instanceof Error ? error.message : 'Ошибка преобразования строки' };
  }
}
