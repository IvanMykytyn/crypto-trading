import { createSelector } from "@reduxjs/toolkit";

import { buildCoinPositionsFromOrders } from "./positionsFromOrders";
import type { RootState } from "./rootReducer";

export const selectOrders = (state: RootState) => state.orders?.items ?? [];

export const selectOrdersByCoinId = createSelector(
  [selectOrders, (_state: RootState, coinId: string) => coinId],
  (orders, coinId) =>
    orders
      .filter((o) => o.coinId === coinId)
      .sort((a, b) => b.createdAt - a.createdAt),
);

export const selectEurBalance = (state: RootState) =>
  state.profile?.eurBalance ?? 0;

export const selectRecentlyViewed = (state: RootState) =>
  state.recent?.recentlyViewed ?? [];

/** Open positions derived from order history (CoinGecko id → position). */
export const selectCoinPositions = createSelector([selectOrders], (orders) =>
  buildCoinPositionsFromOrders(orders),
);

export const selectHoldingForCoin = (state: RootState, coinId: string) =>
  selectCoinPositions(state)[coinId]?.quantity ?? 0;

/** CoinGecko ids with a non-zero open balance (for batched price requests). */
export const selectHeldCoinIds = createSelector([selectCoinPositions], (pos) =>
  Object.entries(pos)
    .filter(([, p]) => p.quantity > 0)
    .map(([id]) => id),
);
