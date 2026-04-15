import { createTheme, colorsTuple } from "@mantine/core";

const fromToken = (varName: string) => colorsTuple(`var(${varName})`);

export const appTheme = createTheme({
  cursorType: "pointer",
  primaryColor: "logo",
  primaryShade: 5,
  defaultRadius: "md",
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  colors: {
    logo: fromToken("--app-logo"),
    btn: fromToken("--app-btn"),
    ink: fromToken("--app-ink"),
    body: fromToken("--app-body"),
    profit: fromToken("--app-profit"),
    currency: fromToken("--app-currency"),
    navbarBorder: fromToken("--app-navbar-border"),
    searchWell: fromToken("--app-search-well"),
  },
});
