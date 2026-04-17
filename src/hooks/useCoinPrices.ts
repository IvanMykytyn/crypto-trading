import { useQuery } from "@tanstack/react-query";
import { fetchSimplePrice } from "../api/coingecko/simple-price";
import { COINGECKO_VS_CURRENCY_EUR } from "../constants/market";
import { queryKeys } from "../constants/query-keys";
import { REFETCH_INTERVAL_MS } from "../constants/query-timing";

export function useCoinPrices(coinId: string | undefined) {
  const trimmed = coinId?.trim() ?? "";

  return useQuery({
    queryKey: queryKeys.coingecko.coinPrices(trimmed),
    queryFn: () =>
      fetchSimplePrice({
        ids: [trimmed],
        vs_currencies: [COINGECKO_VS_CURRENCY_EUR],
      }),
    select: (data) => data[trimmed]?.[COINGECKO_VS_CURRENCY_EUR],
    enabled: trimmed.length > 0,
    refetchInterval: REFETCH_INTERVAL_MS.liveCoinPrice,
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
