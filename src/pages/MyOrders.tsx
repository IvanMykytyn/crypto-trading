import { useMemo } from "react";

import { OrderHistoryList } from "../components/orders/OrderHistoryList";
import { CoinPositionsTable } from "../components/profile/CoinPositionsTable";
import { Button } from "../components/shared/Button";
import { usePortfolioPrices } from "../hooks/usePortfolioPrices";
import { getRequestErrorMessage } from "../lib/axios-error";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { creditEur } from "../store/profileSlice";
import type { Order } from "../store/ordersSlice";
import {
  selectCoinPositions,
  selectEurBalance,
  selectHeldCoinIds,
  selectOrders,
} from "../store/selectors";

/** Orders are newest-first; keep the first symbol seen per coin (latest trade). */
function buildSymbolByCoinId(orders: Order[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const o of orders) {
    if (map[o.coinId] == null) {
      map[o.coinId] = o.coinSymbol;
    }
  }
  return map;
}

export default function MyOrders() {
  const orders = useAppSelector(selectOrders);
  const dispatch = useAppDispatch();
  const eurBalance = useAppSelector(selectEurBalance);
  const positions = useAppSelector(selectCoinPositions);
  const coinIds = useAppSelector(selectHeldCoinIds);

  const symbolByCoinId = useMemo(() => buildSymbolByCoinId(orders), [orders]);

  const {
    data: priceById,
    isLoading: isLoadingPrices,
    isError: isPricesError,
    error: pricesError,
  } = usePortfolioPrices(coinIds);

  const pricesErrorMessage = isPricesError
    ? getRequestErrorMessage(pricesError)
    : null;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-ink">My Orders</h1>
        <p className="text-sm text-body">
          All trades across coins. Coin detail pages show the same data filtered
          to that asset.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            dispatch(creditEur(1000));
          }}
        >
          Deposit 1000 €
        </Button>
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Reset all orders and prices
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Profile</h2>
        <p className="text-sm text-body">
          EUR balance:{" "}
          <span className="font-medium text-ink">
            {eurBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            €
          </span>
        </p>

        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-ink">Coin positions</h3>
          <CoinPositionsTable
            positions={positions}
            symbolByCoinId={symbolByCoinId}
            priceById={priceById}
            isLoadingPrices={isLoadingPrices}
            pricesErrorMessage={pricesErrorMessage}
          />
        </div>
      </section>

      <section className="max-w-[400px] space-y-2">
        <h2 className="text-sm font-semibold text-ink">Order history</h2>
        <OrderHistoryList orders={orders} />
      </section>
    </div>
  );
}
