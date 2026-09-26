import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { operationsService } from "../api/operations";
import type { OperationsQuery } from "../types";

export const operationsQueryKeys = {
  all: ["operations"] as const,
  list: (query: OperationsQuery) => [...operationsQueryKeys.all, query] as const,
};

export function useOperationsQuery(query: OperationsQuery) {
  return useQuery({
    queryKey: operationsQueryKeys.list(query),
    queryFn: () => operationsService.getAll(query),
    // Пока API загружает следующую страницу, таблица показывает предыдущую без пустого мигания.
    placeholderData: keepPreviousData,
  });
}
