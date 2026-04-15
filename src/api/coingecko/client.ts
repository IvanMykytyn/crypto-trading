import { createApiClient } from "../http/create-client";

const DEFAULT_BASE = "https://api.coingecko.com/api/v3";

function getApiKey(): string {
  const key = import.meta.env.VITE_COINGECKO_API_KEY;
  if (!key?.trim()) {
    throw new Error(
      "Missing VITE_COINGECKO_API_KEY. Add it to your .env file for CoinGecko demo API requests.",
    );
  }
  return key.trim();
}

const baseURL = import.meta.env.VITE_COINGECKO_BASE_URL || DEFAULT_BASE;

export const coingeckoApi = createApiClient({
  baseURL,
  headers: {
    "x-cg-demo-api-key": getApiKey(),
  },
});
