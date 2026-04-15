import { useQuery } from "@tanstack/react-query";

import {
  fetchCoinsMarkets,
  type CoinsMarketsParams,
} from "../api/coingecko/markets";

export function useCoinsMarkets(params: CoinsMarketsParams) {
  const { vs_currency, per_page, page } = params;
  return useQuery({
    queryKey: ["coingecko", "markets", vs_currency, per_page, page],
    queryFn: () => fetchCoinsMarkets({ vs_currency, per_page, page }),
    staleTime: 60_000,
  });
}
