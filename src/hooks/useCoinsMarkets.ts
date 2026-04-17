import { useQuery } from "@tanstack/react-query";

import {
  fetchCoinsMarkets,
  type CoinsMarketsParams,
} from "../api/coingecko/markets";
import { queryKeys } from "../constants/query-keys";
import { STALE_TIME_MS } from "../constants/query-timing";

export function useCoinsMarkets(params: CoinsMarketsParams) {
  const { vs_currency, per_page, page } = params;
  return useQuery({
    queryKey: queryKeys.coingecko.markets(vs_currency, per_page, page),
    queryFn: () => fetchCoinsMarkets({ vs_currency, per_page, page }),
    staleTime: STALE_TIME_MS.marketsList,
  });
}
