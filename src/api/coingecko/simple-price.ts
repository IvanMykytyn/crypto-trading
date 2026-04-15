import { coingeckoApi } from "./client";

/** Map of coin id → vs-currency amounts (e.g. `{ eur: 12.34 }`). */
export type SimplePriceResponse = Record<string, Record<string, number>>;

function toCommaList(value: string | string[]): string {
  if (Array.isArray(value)) {
    return [...new Set(value.map((s) => s.trim()).filter(Boolean))].join(",");
  }
  return value.trim();
}

export type FetchSimplePriceParams = {
  ids: string | string[];
  vs_currencies: string | string[];
};

/**
 * @see https://docs.coingecko.com/reference/simple-price
 */
export async function fetchSimplePrice(
  params: FetchSimplePriceParams,
): Promise<SimplePriceResponse> {
  const ids = toCommaList(params.ids);
  const vs_currencies = toCommaList(params.vs_currencies);
  if (!ids) {
    throw new Error("ids is required.");
  }
  if (!vs_currencies) {
    throw new Error("vs_currencies is required.");
  }

  const { data } = await coingeckoApi.get<SimplePriceResponse>(
    "/simple/price",
    {
      params: {
        ids,
        vs_currencies,
        precision: 6,
      },
    },
  );
  return data;
}
