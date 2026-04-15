import { MantineProvider } from "@mantine/core";
import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";

import { rootReducer, type RootState } from "../store/rootReducer";
import { appTheme } from "../theme/mantine-theme";

type StoreOptions = {
  preloadedState?: Partial<RootState>;
};

export function createTestStore(options: StoreOptions = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: options.preloadedState,
  });
}

type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  storeOptions?: StoreOptions;
};

export function renderWithProviders(
  ui: ReactElement,
  { storeOptions, ...renderOptions }: CustomRenderOptions = {},
) {
  const store = createTestStore(storeOptions);
  const result = render(
    <Provider store={store}>
      <MantineProvider theme={appTheme} defaultColorScheme="light">
        {ui}
      </MantineProvider>
    </Provider>,
    renderOptions,
  );
  return { ...result, store };
}
