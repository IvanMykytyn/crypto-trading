import { createAsyncThunk } from "@reduxjs/toolkit";

import { addOrder } from "./ordersSlice";
import { buildCoinPositionsFromOrders } from "./positionsFromOrders";
import { creditEur, debitEur } from "./profileSlice";
import type { RootState } from "./rootReducer";

export type TradePayload = {
  coinId: string;
  coinSymbol: string;
  priceEurPerCoin: number;
  eurAmount: number;
  coinAmount: number;
};

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundCoin(n: number): number {
  return Math.round(n * 1e8) / 1e8;
}

export const placeBuy = createAsyncThunk<
  void,
  TradePayload,
  { state: RootState; rejectValue: string }
>(
  "trade/placeBuy",
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { eurAmount, coinAmount, priceEurPerCoin, coinId, coinSymbol } =
      payload;
    if (eurAmount <= 0 || coinAmount <= 0 || priceEurPerCoin <= 0) {
      return rejectWithValue("Enter positive EUR and coin amounts.");
    }

    const balance = getState().profile.eurBalance;
    const eurRounded = roundMoney(eurAmount);
    if (eurRounded > balance) {
      return rejectWithValue("Not enough EUR balance.");
    }

    dispatch(
      addOrder({
        coinId,
        coinSymbol,
        side: "buy",
        eurAmount: eurRounded,
        coinAmount: roundCoin(coinAmount),
        priceEurPerCoin,
      }),
    );
    dispatch(debitEur(eurRounded));
  },
);

export const placeSell = createAsyncThunk<
  void,
  TradePayload,
  { state: RootState; rejectValue: string }
>(
  "trade/placeSell",
  async (payload, { getState, dispatch, rejectWithValue }) => {
    const { eurAmount, coinAmount, priceEurPerCoin, coinId, coinSymbol } =
      payload;
    if (eurAmount <= 0 || coinAmount <= 0 || priceEurPerCoin <= 0) {
      return rejectWithValue("Enter positive EUR and coin amounts.");
    }

    const held =
      buildCoinPositionsFromOrders(getState().orders.items)[coinId]?.quantity ??
      0;
    const coinRounded = roundCoin(coinAmount);
    if (coinRounded > held) {
      return rejectWithValue("Not enough coins to sell.");
    }

    dispatch(
      addOrder({
        coinId,
        coinSymbol,
        side: "sell",
        eurAmount: roundMoney(eurAmount),
        coinAmount: coinRounded,
        priceEurPerCoin,
      }),
    );
    dispatch(creditEur(roundMoney(eurAmount)));
  },
);
