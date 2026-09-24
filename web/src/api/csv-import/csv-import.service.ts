import { apiClient } from "../client";
import type { CsvImportResult } from "../../types";

export const csvImportService = {
  async importFile(file: File): Promise<CsvImportResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<CsvImportResult>(
      "/csv-import",
      formData,
    );

    return response.data;
  },
};
