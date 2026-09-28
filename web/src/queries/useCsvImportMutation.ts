import { useMutation, useQueryClient } from "@tanstack/react-query";
import { csvImportService } from "../api/csv-import";
import { operationsQueryKeys } from "./useOperationsQuery";

type UseCsvImportMutationOptions = {
  onSuccess?: () => void;
};

export function useCsvImportMutation(options: UseCsvImportMutationOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: csvImportService.importFile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: operationsQueryKeys.all });
      options.onSuccess?.();
    },
  });
}
