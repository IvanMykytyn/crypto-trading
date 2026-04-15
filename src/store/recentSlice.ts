import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type RecentCoinView = {
  coinId: string;
  name: string;
  symbol: string;
  image?: string;
};

type RecentState = {
  recentlyViewed: RecentCoinView[];
};

const initialState: RecentState = {
  recentlyViewed: [],
};

const recentSlice = createSlice({
  name: "recent",
  initialState,
  reducers: {
    recordCoinView(state, action: PayloadAction<RecentCoinView>) {
      const next = state.recentlyViewed.filter(
        (c) => c.coinId !== action.payload.coinId,
      );
      state.recentlyViewed = [action.payload, ...next].slice(0, 5);
    },
  },
});

export const { recordCoinView } = recentSlice.actions;
export default recentSlice.reducer;
