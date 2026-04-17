import type { CoingeckoVsCurrencyEur } from "./market";

/**
 * Hierarchical query keys for TanStack Query — stable cache identity and easier invalidation later.
 * @see https://tkdodo.eu/blog/effective-react-query-keys
 */

const root = ["coingecko"] as const;

const coin = (coinId: string) => [...root, "coin", coinId] as const;

export const queryKeys = {
  coingecko: {
    root,

    coin,

    coinPrices: (coinId: string) => [...coin(coinId), "prices"] as const,

    markets: (vs: string, perPage: number, page: number) =>
      [...root, "markets", vs, perPage, page] as const,

    navbarSuggestions: (searchValue: string) =>
      [...root, "navbar-suggestions", searchValue] as const,

    portfolioPrices: (vs: CoingeckoVsCurrencyEur, sortedIdsKey: string) =>
      [...root, "portfolio", vs, sortedIdsKey] as const,

    marketChart: (
      coinId: string,
      vs: string,
      days: number | "max" | undefined,
      interval: string | null,
      precision: string | null,
    ) =>
      [...coin(coinId), "market_chart", vs, days, interval, precision] as const,
  },
} as const;
