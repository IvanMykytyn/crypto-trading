/**
 * Single source of truth for in-app navigation.
 */

export const ROUTE_SEGMENT = {
  dashboard: "dashboard",
  myOrders: "my-orders",
  coin: "coin",
} as const;

export const ROUTE_PATH = {
  home: "/",
  dashboard: `/${ROUTE_SEGMENT.dashboard}`,
  myOrders: `/${ROUTE_SEGMENT.myOrders}`,
  coin: (coinId: string) =>
    `/${ROUTE_SEGMENT.coin}/${encodeURIComponent(coinId.trim())}`,
} as const;
