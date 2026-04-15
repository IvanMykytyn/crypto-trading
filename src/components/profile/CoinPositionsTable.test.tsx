import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CoinPositionsTable } from "./CoinPositionsTable";

describe("CoinPositionsTable", () => {
  it("shows empty copy when there are no positions", () => {
    render(
      <CoinPositionsTable
        positions={{}}
        symbolByCoinId={{}}
        priceById={{}}
        isLoadingPrices={false}
      />,
    );
    expect(screen.getByText("No coin holdings yet.")).toBeInTheDocument();
  });

  it("shows loading hint when prices are loading", () => {
    render(
      <CoinPositionsTable
        positions={{
          bitcoin: { quantity: 0.1, avgCostEurPerCoin: 40_000 },
        }}
        symbolByCoinId={{ bitcoin: "BTC" }}
        priceById={undefined}
        isLoadingPrices={true}
      />,
    );
    expect(screen.getByText("Loading market prices…")).toBeInTheDocument();
  });

  it("shows API error message when provided", () => {
    render(
      <CoinPositionsTable
        positions={{
          bitcoin: { quantity: 0.1, avgCostEurPerCoin: 40_000 },
        }}
        symbolByCoinId={{ bitcoin: "BTC" }}
        priceById={undefined}
        isLoadingPrices={false}
        pricesErrorMessage="Request failed (429): Rate limited"
      />,
    );
    expect(
      screen.getByText("Request failed (429): Rate limited"),
    ).toBeInTheDocument();
  });

  it("renders table with asset and subtotal when prices exist", () => {
    render(
      <CoinPositionsTable
        positions={{
          bitcoin: { quantity: 0.1, avgCostEurPerCoin: 40_000 },
        }}
        symbolByCoinId={{ bitcoin: "BTC" }}
        priceById={{ bitcoin: { eur: 50_000 } }}
        isLoadingPrices={false}
      />,
    );

    const table = screen.getByRole("table");
    expect(within(table).getByText("BTC")).toBeInTheDocument();
    expect(within(table).getByText("bitcoin")).toBeInTheDocument();
    expect(
      within(table).getByText("Subtotal (rows with a live price)"),
    ).toBeInTheDocument();
    expect(screen.getByText(/Unrealized P\/L uses/)).toBeInTheDocument();
  });
});
