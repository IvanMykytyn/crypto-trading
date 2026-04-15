import { combineReducers } from "@reduxjs/toolkit";

import ordersReducer from "./ordersSlice";
import profileReducer from "./profileSlice";
import recentReducer from "./recentSlice";

export const rootReducer = combineReducers({
  orders: ordersReducer,
  profile: profileReducer,
  recent: recentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
