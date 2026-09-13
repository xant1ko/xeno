import { OperationFields } from '../../operations/types/operation.type';

// Описываем исходные колонки банковского CSV-файла.
export type CsvRow = Record<string, string>;

// Описываем одну преобразованную операцию для ответа API.
export type TransactionImportRow = OperationFields;

// Описываем ошибку одной строки без остановки всего импорта.
export type CsvImportError = {
  // Указываем номер строки в исходном CSV.
  row: number;
  // Указываем исходное имя проблемной колонки.
  field?: string;
  // Показываем проблемное значение без содержимого других строк.
  value?: string;
  // Объясняем причину ошибки.
  message: string;
};

// Возвращаем успешные строки и ошибки частичного импорта.
export type CsvImportResult = {
  // Сохраняем успешно преобразованные операции.
  rows: TransactionImportRow[];
  // Сохраняем ошибки отдельных строк.
  errors: CsvImportError[];
};
