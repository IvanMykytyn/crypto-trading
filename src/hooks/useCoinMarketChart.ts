import { useQuery } from "@tanstack/react-query";
import {
  fetchCoinMarketChart,
  type FetchCoinMarketChartParams,
} from "../api/coingecko/market-chart";
import { queryKeys } from "../constants/query-keys";
import { STALE_TIME_MS } from "../constants/query-timing";

export function useCoinMarketChart(
  coinId: string | undefined,
  params: FetchCoinMarketChartParams | undefined,
) {
  const trimmedId = coinId?.trim() ?? "";
  const vs = params?.vs_currency?.trim() ?? "";
  const days = params?.days;

  return useQuery({
    queryKey: queryKeys.coingecko.marketChart(
      trimmedId,
      vs,
      days,
      params?.interval ?? null,
      params?.precision ?? null,
    ),
    queryFn: () => {
      if (params == null) {
        throw new Error("useCoinMarketChart: query ran without params.");
      }
      return fetchCoinMarketChart(trimmedId, params);
    },
    refetchOnWindowFocus: true,
    enabled:
      trimmedId.length > 0 &&
      vs.length > 0 &&
      params != null &&
      days !== undefined,
    staleTime: STALE_TIME_MS.coinMarketChart,
  });
}
