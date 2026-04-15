import { coingeckoApi } from "./client";

/** `[unix_ms, value]` pairs returned by `/coins/{id}/market_chart`. */
export type MarketChartPoint = [timestampMs: number, value: number];

export type CoinMarketChartResponse = {
  prices: MarketChartPoint[];
  market_caps: MarketChartPoint[];
  total_volumes: MarketChartPoint[];
};

export type FetchCoinMarketChartParams = {
  /** Fiat or crypto id, e.g. `usd`. */
  vs_currency: string;
  /**
   * Window length. CoinGecko accepts numeric days or `max`.
   * @see https://docs.coingecko.com/reference/coins-id-market-chart
   */
  days: number | "max";
  /** e.g. `daily` for long ranges on some plans. */
  interval?: string;
  /** `full` for full precision where supported. */
  precision?: string;
};

export async function fetchCoinMarketChart(
  coinId: string,
  params: FetchCoinMarketChartParams,
): Promise<CoinMarketChartResponse> {
  const id = coinId.trim();
  if (!id) {
    throw new Error("Coin id is required.");
  }
  const vs = params.vs_currency.trim();
  if (!vs) {
    throw new Error("vs_currency is required.");
  }

  const { data } = await coingeckoApi.get<CoinMarketChartResponse>(
    `/coins/${encodeURIComponent(id)}/market_chart`,
    {
      params: {
        vs_currency: vs,
        days: params.days,
        ...(params.interval != null && params.interval !== ""
          ? { interval: params.interval }
          : {}),
        ...(params.precision != null && params.precision !== ""
          ? { precision: params.precision }
          : {}),
      },
    },
  );
  return data;
}
