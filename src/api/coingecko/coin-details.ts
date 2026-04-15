import { coingeckoApi } from "./client";

/**
 * Subset of `GET /coins/{id}` used by the app. CoinGecko returns additional fields.
 * @see https://docs.coingecko.com/reference/coins-id
 */
export type CoinDetailsResponse = {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  market_data: {
    price_change_24h_in_currency: Partial<Record<string, number>>;
  };
};

export async function fetchCoinDetails(
  coinId: string,
): Promise<CoinDetailsResponse> {
  const id = coinId.trim();
  if (!id) {
    throw new Error("Coin id is required.");
  }
  const { data } = await coingeckoApi.get<CoinDetailsResponse>(
    `/coins/${encodeURIComponent(id)}`,
  );
  return data;
}
