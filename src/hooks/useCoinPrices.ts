import { useQuery } from "@tanstack/react-query";
import { fetchSimplePrice } from "../api/coingecko/simple-price";

export function useCoinPrices(coinId: string | undefined) {
  const trimmed = coinId?.trim() ?? "";

  return useQuery({
    queryKey: ["coingecko", "coin", trimmed, "prices"],
    queryFn: () => fetchSimplePrice({ ids: [trimmed], vs_currencies: ["eur"] }),
    select: (data) => data[trimmed]?.eur,
    enabled: trimmed.length > 0,
    refetchInterval: 10000,
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
