import { FIAT_CURRENCY_CODE_EUR } from "../constants/market";

export function eurPriceFormatOptions(n: number): Intl.NumberFormatOptions {
  const mag = Math.abs(n);
  return {
    style: "currency",
    currency: FIAT_CURRENCY_CODE_EUR,
    minimumFractionDigits: 2,
    maximumFractionDigits: mag >= 1 ? 2 : 6,
  };
}

export function formatEurPrice(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) {
    return "—";
  }
  return n.toLocaleString(undefined, eurPriceFormatOptions(n));
}

/** 24h-style signed line: explicit `+` on gains; `Intl` minus on losses. */
export function formatSignedEurChange(n: number): string {
  if (n > 0) {
    return `+${formatEurPrice(n)}`;
  }
  return formatEurPrice(n);
}

export function formatCompactEur(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) {
    return "—";
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: FIAT_CURRENCY_CODE_EUR,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Coin quantities in tables and order history (tighter precision above ~1 coin). */
export function formatCoinAmount(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) {
    return "—";
  }
  const mag = Math.abs(n);
  return n.toLocaleString(undefined, {
    maximumFractionDigits: mag < 2 ? 8 : 4,
  });
}

export function formatSignedPercent(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
}
