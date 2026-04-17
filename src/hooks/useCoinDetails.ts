import { useQuery } from "@tanstack/react-query";
import { fetchCoinDetails } from "../api/coingecko/coin-details";
import { queryKeys } from "../constants/query-keys";
import { STALE_TIME_MS } from "../constants/query-timing";

export function useCoinDetails(coinId: string | undefined) {
  const trimmed = coinId?.trim() ?? "";

  return useQuery({
    queryKey: queryKeys.coingecko.coin(trimmed),
    queryFn: () => fetchCoinDetails(trimmed),
    enabled: trimmed.length > 0,
    staleTime: STALE_TIME_MS.coinDetails,
  });
}
