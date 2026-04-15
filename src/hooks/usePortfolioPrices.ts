import { useQuery } from "@tanstack/react-query";

import { fetchSimplePrice } from "../api/coingecko/simple-price";

/**
 * Live EUR quotes for many CoinGecko ids (portfolio / balances).
 */
export function usePortfolioPrices(coinIds: string[]) {
  const unique = [...new Set(coinIds.map((id) => id.trim()).filter(Boolean))];
  const key = unique.slice().sort().join(",");

  return useQuery({
    queryKey: ["coingecko", "portfolio", "eur", key],
    queryFn: () =>
      fetchSimplePrice({
        ids: unique,
        vs_currencies: ["eur"],
      }),
    enabled: unique.length > 0,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
