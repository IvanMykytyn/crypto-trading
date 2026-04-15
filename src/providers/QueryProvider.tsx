import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { createQueryClient } from "../lib/query-client";

type QueryProviderProps = {
  children: ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  const [client] = useState(createQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
