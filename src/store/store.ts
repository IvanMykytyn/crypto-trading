import {
  type ThunkDispatch,
  type UnknownAction,
  configureStore,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";

import { rootReducer, type RootState } from "./rootReducer";

function createAsyncLocalStorage() {
  return {
    getItem(key: string): Promise<string | null> {
      try {
        return Promise.resolve(localStorage.getItem(key));
      } catch {
        return Promise.resolve(null);
      }
    },
    setItem(key: string, value: string): Promise<void> {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* */
      }
      return Promise.resolve();
    },
    removeItem(key: string): Promise<void> {
      try {
        localStorage.removeItem(key);
      } catch {
        /*  */
      }
      return Promise.resolve();
    },
  };
}

/** New key drops legacy persisted shapes; profile is EUR-only, positions come from orders. */
const persistConfig = {
  key: "cmd-portfolio-v2",
  storage: createAsyncLocalStorage(),
  whitelist: ["orders", "profile", "recent"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

/**
 * `persistReducer` loosens the reducer action generic, so `typeof store.dispatch`
 * no longer includes thunk overloads. Thunks must be typed explicitly.
 */
export type AppDispatch = ThunkDispatch<RootState, undefined, UnknownAction>;
