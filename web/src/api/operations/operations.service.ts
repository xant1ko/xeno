import { apiClient } from "../client";
import type { OperationsPage, OperationsQuery } from "../../types";

export const operationsService = {
  async getAll(query: OperationsQuery = {}): Promise<OperationsPage> {
    const response = await apiClient.get<OperationsPage>("/operations", {
      params: query,
    });

    return response.data;
  },
};
