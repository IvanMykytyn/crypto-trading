import { describe, expect, it } from "vitest";

import type { Order } from "./ordersSlice";
import { buildCoinPositionsFromOrders } from "./positionsFromOrders";

function order(partial: Partial<Order> & Pick<Order, "side">): Order {
  return {
    id: partial.id ?? "o1",
    coinId: partial.coinId ?? "bitcoin",
    coinSymbol: partial.coinSymbol ?? "BTC",
    side: partial.side,
    eurAmount: partial.eurAmount ?? 100,
    coinAmount: partial.coinAmount ?? 0.01,
    priceEurPerCoin: partial.priceEurPerCoin ?? 10_000,
    createdAt: partial.createdAt ?? 1,
  };
}

describe("buildCoinPositionsFromOrders", () => {
  it("returns empty object when there are no orders", () => {
    expect(buildCoinPositionsFromOrders([])).toEqual({});
  });

  it("accumulates buys with weighted average cost", () => {
    const orders: Order[] = [
      order({
        side: "buy",
        createdAt: 1,
        eurAmount: 100,
        coinAmount: 0.1,
        priceEurPerCoin: 1000,
      }),
      order({
        side: "buy",
        createdAt: 2,
        eurAmount: 200,
        coinAmount: 0.1,
        priceEurPerCoin: 2000,
      }),
    ];
    const pos = buildCoinPositionsFromOrders(orders).bitcoin;
    expect(pos).toBeDefined();
    expect(pos!.quantity).toBeCloseTo(0.2, 5);
    expect(pos!.avgCostEurPerCoin).toBeCloseTo(1500, 5);
  });

  it("sorts by createdAt so order of arguments does not matter", () => {
    const newerFirst: Order[] = [
      order({
        id: "2",
        side: "buy",
        createdAt: 200,
        eurAmount: 100,
        coinAmount: 0.1,
      }),
      order({
        id: "1",
        side: "buy",
        createdAt: 100,
        eurAmount: 100,
        coinAmount: 0.1,
      }),
    ];
    const pos = buildCoinPositionsFromOrders(newerFirst).bitcoin;
    expect(pos!.quantity).toBeCloseTo(0.2, 5);
    expect(pos!.avgCostEurPerCoin).toBeCloseTo(1000, 2);
  });

  it("removes position when sold to zero", () => {
    const orders: Order[] = [
      order({
        id: "1",
        side: "buy",
        createdAt: 1,
        eurAmount: 100,
        coinAmount: 0.5,
      }),
      order({
        id: "2",
        side: "sell",
        createdAt: 2,
        eurAmount: 110,
        coinAmount: 0.5,
      }),
    ];
    expect(buildCoinPositionsFromOrders(orders)).toEqual({});
  });

  it("keeps reduced position after partial sell with same average", () => {
    const orders: Order[] = [
      order({
        id: "1",
        side: "buy",
        createdAt: 1,
        eurAmount: 100,
        coinAmount: 1,
      }),
      order({
        id: "2",
        side: "sell",
        createdAt: 2,
        eurAmount: 50,
        coinAmount: 0.5,
      }),
    ];
    const pos = buildCoinPositionsFromOrders(orders).bitcoin;
    expect(pos!.quantity).toBeCloseTo(0.5, 5);
    expect(pos!.avgCostEurPerCoin).toBeCloseTo(100, 5);
  });

  it("tracks multiple coin ids independently", () => {
    const orders: Order[] = [
      order({
        coinId: "bitcoin",
        coinSymbol: "BTC",
        side: "buy",
        createdAt: 1,
        eurAmount: 10,
        coinAmount: 0.001,
      }),
      order({
        coinId: "ethereum",
        coinSymbol: "ETH",
        side: "buy",
        createdAt: 2,
        eurAmount: 20,
        coinAmount: 0.01,
      }),
    ];
    const map = buildCoinPositionsFromOrders(orders);
    expect(map.bitcoin).toBeDefined();
    expect(map.ethereum).toBeDefined();
    expect(map.bitcoin!.quantity).toBeCloseTo(0.001, 6);
    expect(map.ethereum!.quantity).toBeCloseTo(0.01, 6);
  });
});
