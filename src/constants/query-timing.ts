export const STALE_TIME_MS = {
  /** Coin metadata (name, image, 24h change fields). */
  coinDetails: 60_000,
  /** Paginated markets table on the dashboard. */
  marketsList: 60_000,
  /** OHLC / market_chart series. */
  coinMarketChart: 30_000,
  /** Batched simple prices for portfolio rows. */
  portfolioPrices: 30_000,
  /** Trending list when the search box is empty (stable result). */
  navbarTrending: 300_000,
} as const;

export const REFETCH_INTERVAL_MS = {
  liveCoinPrice: 10_000,
  portfolioPrices: 60_000,
} as const;

export const NAVBAR_SEARCH_DEBOUNCE_MS = 400;
