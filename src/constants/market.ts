/**
 * Fiat / quote configuration. The app is EUR-only for balances and CoinGecko quotes.
 *
 * CoinGecko uses lowercase tokens in query params (`vs_currency`, `vs_currencies`);
 * `Intl` and user-facing copy use ISO 4217 uppercase.
 */

export const COINGECKO_VS_CURRENCY_EUR = "eur" as const;

export type CoingeckoVsCurrencyEur = typeof COINGECKO_VS_CURRENCY_EUR;

export const FIAT_CURRENCY_CODE_EUR = "EUR" as const;
