import { coingeckoApi } from "./client";
import type {
  CoinSuggestion,
  SearchQueryResponse,
  TrendingSearchResponse,
} from "./types";

function toSuggestion(coin: {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank?: number | null;
}): CoinSuggestion {
  const sym = coin.symbol.toUpperCase();
  return {
    value: coin.id,
    label: coin.name,
    name: coin.name,
    symbol: sym,
    thumb: coin.thumb,
    marketCapRank: coin.market_cap_rank ?? null,
  };
}

export async function fetchTrendingCoins(): Promise<CoinSuggestion[]> {
  const { data } =
    await coingeckoApi.get<TrendingSearchResponse>("/search/trending");
  return data.coins.map((entry) => toSuggestion(entry.item));
}

export async function searchCoins(query: string): Promise<CoinSuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }
  const { data } = await coingeckoApi.get<SearchQueryResponse>("/search", {
    params: { query: trimmed },
  });
  return (data.coins ?? []).map(toSuggestion);
}
