import { useQuery } from "@tanstack/react-query";
import { fetchCoinDetails } from "../api/coingecko/coin-details";

export function useCoinDetails(coinId: string | undefined) {
  const trimmed = coinId?.trim() ?? "";

  return useQuery({
    queryKey: ["coingecko", "coin", trimmed],
    queryFn: () => fetchCoinDetails(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 60000,
  });
}
