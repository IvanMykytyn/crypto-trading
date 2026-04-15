import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "../store/store";

type Props = {
  children: React.ReactNode;
};

export function StoreProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
