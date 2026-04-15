export type TrendingSearchResponse = {
  coins: Array<{
    item: {
      id: string;
      name: string;
      symbol: string;
      thumb: string;
      market_cap_rank: number | null;
    };
  }>;
};

export type SearchQueryResponse = {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank?: number | null;
  }>;
};

/** Option row for navbar coin search (Autocomplete `data` item + API fields). */
export type CoinSuggestion = {
  value: string;
  label: string;
  name: string;
  symbol: string;
  thumb: string;
  marketCapRank: number | null;
};
