import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

export const OrderSide = {
  Buy: "buy",
  Sell: "sell",
} as const;

export type OrderSide = (typeof OrderSide)[keyof typeof OrderSide];

export type Order = {
  id: string;
  coinId: string;
  coinSymbol: string;
  side: OrderSide;
  eurAmount: number;
  coinAmount: number;
  priceEurPerCoin: number;
  createdAt: number;
};

type OrdersState = {
  items: Order[];
};

const initialState: OrdersState = {
  items: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: {
      reducer(state, action: PayloadAction<Order>) {
        state.items.unshift(action.payload);
      },
      prepare(payload: Omit<Order, "id" | "createdAt">) {
        return {
          payload: {
            ...payload,
            id: nanoid(),
            createdAt: Date.now(),
          } satisfies Order,
        };
      },
    },
  },
});

export const { addOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
