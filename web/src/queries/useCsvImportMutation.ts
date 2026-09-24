import { useMutation, useQueryClient } from "@tanstack/react-query";
import { csvImportService } from "../api/csv-import";
import { operationsQueryKeys } from "./useOperationsQuery";

export function useCsvImportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: csvImportService.importFile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: operationsQueryKeys.all }),
  });
}
