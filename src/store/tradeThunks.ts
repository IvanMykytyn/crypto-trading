import { createAsyncThunk } from "@reduxjs/toolkit";

import { FIAT_CURRENCY_CODE_EUR } from "../constants/market";
import { roundCoinQuantity, roundEurAmount } from "../utils/money";
import { addOrder, OrderSide } from "./ordersSlice";
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
      return rejectWithValue(
        `Enter positive ${FIAT_CURRENCY_CODE_EUR} and coin amounts.`,
      );
    }

    const balance = getState().profile.eurBalance;
    const eurRounded = roundEurAmount(eurAmount);
    if (eurRounded > balance) {
      return rejectWithValue(`Not enough ${FIAT_CURRENCY_CODE_EUR} balance.`);
    }

    dispatch(
      addOrder({
        coinId,
        coinSymbol,
        side: OrderSide.Buy,
        eurAmount: eurRounded,
        coinAmount: roundCoinQuantity(coinAmount),
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
      return rejectWithValue(
        `Enter positive ${FIAT_CURRENCY_CODE_EUR} and coin amounts.`,
      );
    }

    const held =
      buildCoinPositionsFromOrders(getState().orders.items)[coinId]?.quantity ??
      0;
    const coinRounded = roundCoinQuantity(coinAmount);
    if (coinRounded > held) {
      return rejectWithValue("Not enough coins to sell.");
    }

    dispatch(
      addOrder({
        coinId,
        coinSymbol,
        side: OrderSide.Sell,
        eurAmount: roundEurAmount(eurAmount),
        coinAmount: coinRounded,
        priceEurPerCoin,
      }),
    );
    dispatch(creditEur(roundEurAmount(eurAmount)));
  },
);
