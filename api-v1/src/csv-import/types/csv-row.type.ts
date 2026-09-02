// Описываем исходные колонки банковского CSV-файла.
export type CsvRow = Record<string, string>;

// Описываем одну преобразованную операцию для ответа API.
export type TransactionImportRow = {
  // Храним название счёта.
  account_name: string;
  // Храним маскированный номер карты.
  card_number: string;
  // Храним дату операции в формате Date.
  date: Date;
  // Храним сумму операции числом.
  transaction_amount: number;
  // Храним валюту операции.
  currency: string;
  // Храним статус операции.
  status: string;
  // Храним банковскую категорию.
  default_category: string;
  // Храним пользовательскую категорию.
  custom_category: string;
  // Храним описание операции.
  description: string;
  // Храним сообщение по операции.
  message: string;
};

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
