import { useQuery } from "@tanstack/react-query";

import { fetchSimplePrice } from "../api/coingecko/simple-price";
import { COINGECKO_VS_CURRENCY_EUR } from "../constants/market";
import { queryKeys } from "../constants/query-keys";
import { REFETCH_INTERVAL_MS, STALE_TIME_MS } from "../constants/query-timing";

/**
 * Live EUR quotes for many CoinGecko ids (portfolio / balances).
 */
export function usePortfolioPrices(coinIds: string[]) {
  const unique = [...new Set(coinIds.map((id) => id.trim()).filter(Boolean))];
  const key = unique.slice().sort().join(",");

  return useQuery({
    queryKey: queryKeys.coingecko.portfolioPrices(
      COINGECKO_VS_CURRENCY_EUR,
      key,
    ),
    queryFn: () =>
      fetchSimplePrice({
        ids: unique,
        vs_currencies: [COINGECKO_VS_CURRENCY_EUR],
      }),
    enabled: unique.length > 0,
    staleTime: STALE_TIME_MS.portfolioPrices,
    refetchInterval: REFETCH_INTERVAL_MS.portfolioPrices,
  });
}
