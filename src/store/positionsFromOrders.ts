import type { Order } from "./ordersSlice";

export type CoinPosition = {
  quantity: number;
  /** Volume-weighted average cost in EUR per coin for the open size (from order history). */
  avgCostEurPerCoin: number;
};

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundCoin(n: number): number {
  return Math.round(n * 1e8) / 1e8;
}

/**
 * Open positions + average cost from persisted orders (single source of truth).
 * CoinGecko ids are used elsewhere to fetch live prices.
 */
export function buildCoinPositionsFromOrders(
  orders: Order[],
): Record<string, CoinPosition> {
  const sorted = [...orders].sort((a, b) => a.createdAt - b.createdAt);
  type Acc = { quantity: number; totalCostEur: number };
  const acc: Record<string, Acc> = {};

  for (const o of sorted) {
    const cur = acc[o.coinId] ?? { quantity: 0, totalCostEur: 0 };
    if (o.side === "buy") {
      const quantity = roundCoin(cur.quantity + o.coinAmount);
      const totalCostEur = roundMoney(cur.totalCostEur + o.eurAmount);
      acc[o.coinId] = { quantity, totalCostEur };
    } else {
      const avg = cur.quantity > 0 ? cur.totalCostEur / cur.quantity : 0;
      const quantity = roundCoin(cur.quantity - o.coinAmount);
      const totalCostEur = roundMoney(cur.totalCostEur - o.coinAmount * avg);
      if (quantity <= 0) {
        delete acc[o.coinId];
      } else {
        acc[o.coinId] = { quantity, totalCostEur };
      }
    }
  }

  return Object.fromEntries(
    Object.entries(acc).map(([id, { quantity, totalCostEur }]) => [
      id,
      {
        quantity,
        avgCostEurPerCoin: quantity > 0 ? totalCostEur / quantity : 0,
      } satisfies CoinPosition,
    ]),
  );
}
