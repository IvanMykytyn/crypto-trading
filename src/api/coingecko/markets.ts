import { coingeckoApi } from "./client";

/**
 * Subset of `GET /coins/markets` used by the dashboard table.
 * @see https://docs.coingecko.com/reference/coins-markets
 */
export type CoinMarketListItem = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
};

export type CoinsMarketsParams = {
  vs_currency: string;
  per_page: number;
  page: number;
};

export async function fetchCoinsMarkets(
  params: CoinsMarketsParams,
): Promise<CoinMarketListItem[]> {
  const { data } = await coingeckoApi.get<CoinMarketListItem[]>(
    "/coins/markets",
    {
      params: {
        vs_currency: params.vs_currency,
        per_page: params.per_page,
        page: params.page,
      },
    },
  );
  return data;
}
