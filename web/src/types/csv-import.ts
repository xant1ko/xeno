import type { Operation } from "./operation";

export type CsvImportError = {
  row: number;
  field?: string;
  value?: string;
  message: string;
};

export type CsvImportResult = {
  filename: string;
  total: number;
  success: number;
  failed: number;
  errors: CsvImportError[];
  saved: {
    received: number;
    created: number;
    skipped: number;
    cutoff_date: string | null;
    operations: Operation[];
  };
};
