import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { Order } from "../../../store/ordersSlice";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { CoinTradePanel } from "./CoinTradePanel";

const defaultProps = {
  coinId: "bitcoin",
  coinSymbol: "BTC",
  priceEur: 50_000,
} as const;

function buyOrder(partial: Partial<Order> = {}): Order {
  return {
    id: partial.id ?? "seed-1",
    coinId: partial.coinId ?? "bitcoin",
    coinSymbol: partial.coinSymbol ?? "BTC",
    side: "buy",
    eurAmount: partial.eurAmount ?? 5_000,
    coinAmount: partial.coinAmount ?? 0.1,
    priceEurPerCoin: partial.priceEurPerCoin ?? 50_000,
    createdAt: partial.createdAt ?? 1,
  };
}

describe("CoinTradePanel", () => {
  it("disables buy/sell and shows waiting copy when price is not ready", () => {
    renderWithProviders(
      <CoinTradePanel {...defaultProps} priceEur={undefined} />,
    );

    expect(screen.getByText("Waiting for live price…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^buy$/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /^sell$/i })).toBeDisabled();
  });

  it("shows price fetch error when provided without a live price", () => {
    renderWithProviders(
      <CoinTradePanel
        {...defaultProps}
        priceEur={undefined}
        priceFetchError="Request failed (429): Rate limited"
      />,
    );

    expect(
      screen.getByText("Request failed (429): Rate limited"),
    ).toBeInTheDocument();
  });

  it("shows validation alert when buy is clicked with empty amounts", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CoinTradePanel {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /^buy$/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      "Enter an amount in EUR or in coins (price must be positive).",
    );
  });

  it("places a buy: deducts EUR and appends an order", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <CoinTradePanel {...defaultProps} />,
      {
        storeOptions: {
          preloadedState: {
            orders: { items: [] },
            profile: { eurBalance: 10_000 },
          },
        },
      },
    );

    const inputs = screen.getAllByPlaceholderText("0");
    expect(inputs).toHaveLength(2);
    const eurInput = inputs[1]!;

    await user.clear(eurInput);
    await user.type(eurInput, "500");
    await user.click(screen.getByRole("button", { name: /^buy$/i }));

    await waitFor(() => {
      expect(store.getState().orders.items).toHaveLength(1);
    });

    const order = store.getState().orders.items[0]!;
    expect(order.side).toBe("buy");
    expect(order.coinId).toBe("bitcoin");
    expect(order.eurAmount).toBe(500);
    expect(store.getState().profile.eurBalance).toBe(9500);
  });

  it("shows insufficient EUR when buy exceeds balance", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CoinTradePanel {...defaultProps} />, {
      storeOptions: {
        preloadedState: {
          orders: { items: [] },
          profile: { eurBalance: 100 },
        },
      },
    });

    const inputs = screen.getAllByPlaceholderText("0");
    await user.clear(inputs[1]!);
    await user.type(inputs[1]!, "500");
    await user.click(screen.getByRole("button", { name: /^buy$/i }));

    expect(
      await screen.findByText("Not enough EUR balance."),
    ).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("places a sell when user holds the coin", async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(
      <CoinTradePanel {...defaultProps} />,
      {
        storeOptions: {
          preloadedState: {
            orders: { items: [buyOrder()] },
            profile: { eurBalance: 5_000 },
          },
        },
      },
    );

    const inputs = screen.getAllByPlaceholderText("0");
    const coinInput = inputs[0]!;
    await user.clear(coinInput);
    await user.type(coinInput, "0.05");
    await user.click(screen.getByRole("button", { name: /^sell$/i }));

    await waitFor(() => {
      expect(store.getState().orders.items).toHaveLength(2);
    });

    const latest = store.getState().orders.items[0]!;
    expect(latest.side).toBe("sell");
    expect(latest.coinAmount).toBeCloseTo(0.05, 8);
    expect(store.getState().profile.eurBalance).toBe(7500);
  });

  it("shows not enough coins when sell exceeds holdings", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CoinTradePanel {...defaultProps} />, {
      storeOptions: {
        preloadedState: {
          orders: { items: [buyOrder({ coinAmount: 0.02 })] },
          profile: { eurBalance: 5_000 },
        },
      },
    });

    const inputs = screen.getAllByPlaceholderText("0");
    await user.clear(inputs[0]!);
    await user.type(inputs[0]!, "1");
    await user.click(screen.getByRole("button", { name: /^sell$/i }));

    expect(
      await screen.findByText("Not enough coins to sell."),
    ).toBeInTheDocument();
  });

  it("labels inputs with coin symbol and EUR", () => {
    renderWithProviders(<CoinTradePanel {...defaultProps} />);
    const labels = screen.getAllByText(/^(BTC|EUR)$/);
    expect(labels.some((el) => el.textContent === "BTC")).toBe(true);
    expect(labels.some((el) => el.textContent === "EUR")).toBe(true);
  });
});
