import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ProfileState = {
  eurBalance: number;
};

const initialState: ProfileState = {
  eurBalance: 10_000,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    debitEur(state, action: PayloadAction<number>) {
      state.eurBalance -= action.payload;
    },
    creditEur(state, action: PayloadAction<number>) {
      state.eurBalance += action.payload;
    },
  },
});

export const { debitEur, creditEur } = profileSlice.actions;
export default profileSlice.reducer;
