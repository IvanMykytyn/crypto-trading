/** EUR ledger amounts to cents (2 fractional digits). */
export function roundEurAmount(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Coin size to 8 fractional digits */
export function roundCoinQuantity(n: number): number {
  return Math.round(n * 1e8) / 1e8;
}
