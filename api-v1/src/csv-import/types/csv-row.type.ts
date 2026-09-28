import { OperationFields } from '../../operations/types/operation.type';
export type CsvRow = Record<string, string>;
export type TransactionImportRow = OperationFields;
export type CsvImportError = {
  row: number;
  field?: string;
  value?: string;
  message: string;
};
export type CsvImportResult = {
  rows: TransactionImportRow[];
  errors: CsvImportError[];
};
