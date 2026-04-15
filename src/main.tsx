import { MantineProvider } from "@mantine/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryProvider } from "./providers/QueryProvider";
import { StoreProvider } from "./providers/StoreProvider";
import { appTheme } from "./theme/mantine-theme";
import "./theme/index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <QueryProvider>
        <MantineProvider theme={appTheme} defaultColorScheme="light">
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MantineProvider>
      </QueryProvider>
    </StoreProvider>
  </StrictMode>,
);
