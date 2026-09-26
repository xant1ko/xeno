import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000, // время хранения неиспользуемого cache
      enabled: true, // выполнять query автоматически
      retry: 3, // количество retry
      refetchOnMount: true, // refetch при mount
      refetchOnWindowFocus: true, // refetch при фокусе окна
      retryOnMount: true, // retry ошибки при следующем mount
      select: undefined, // преобразование данных перед выдачей компоненту
    },
  },
});
