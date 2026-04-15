import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Order } from "../../store/ordersSlice";
import { OrderHistoryList } from "./OrderHistoryList";

const sampleOrder: Order = {
  id: "ord-1",
  coinId: "bitcoin",
  coinSymbol: "BTC",
  side: "buy",
  eurAmount: 50.12,
  coinAmount: 0.0015,
  priceEurPerCoin: 33_413.33,
  createdAt: new Date("2026-01-15T12:00:00Z").getTime(),
};

describe("OrderHistoryList", () => {
  it("shows custom empty message when there are no orders", () => {
    render(<OrderHistoryList orders={[]} emptyMessage="Nothing here yet." />);
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("shows default empty copy when emptyMessage is omitted", () => {
    render(<OrderHistoryList orders={[]} />);
    expect(screen.getByText("No orders yet.")).toBeInTheDocument();
  });

  it("renders buy row with symbol and formatted amounts", () => {
    render(<OrderHistoryList orders={[sampleOrder]} />);
    expect(screen.getByText(/Buy/)).toBeInTheDocument();
    expect(screen.getByText(/BTC/)).toBeInTheDocument();
    expect(screen.getByText(/50\.12/)).toBeInTheDocument();
  });

  it("renders sell side label", () => {
    render(
      <OrderHistoryList orders={[{ ...sampleOrder, id: "2", side: "sell" }]} />,
    );
    expect(screen.getByText(/Sell/)).toBeInTheDocument();
  });
});
