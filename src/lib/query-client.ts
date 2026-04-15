import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

function queryRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false;
  }
  if (isAxiosError(error)) {
    const s = error.response?.status;
    if (s != null && s >= 400 && s < 500 && s !== 429) {
      return false;
    }
  }
  return true;
}

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: queryRetry,
      },
    },
  });
}
