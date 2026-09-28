import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000,
      enabled: true,
      retry: 3,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      retryOnMount: true,
      select: undefined,
    },
  },
});
