import { lazy, Suspense, useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router";

const CoinLineChart = lazy(() =>
  import("../components/coins/coin-line-chart/CoinLineChart").then((m) => ({
    default: m.CoinLineChart,
  })),
);
import { CoinTradeModalButton } from "../components/coins/coin-trade-panel/CoinTradeModalButton";
import { CoinTradePanel } from "../components/coins/coin-trade-panel/CoinTradePanel";
import { OrderHistoryList } from "../components/orders/OrderHistoryList";
import { AnimatedNumber } from "../components/shared/AnimatedNumber";
import { useCoinDetails } from "../hooks/useCoinDetails";
import { useCoinPrices } from "../hooks/useCoinPrices";
import { getRequestErrorMessage } from "../lib/axios-error";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { recordCoinView } from "../store/recentSlice";
import {
  selectEurBalance,
  selectHoldingForCoin,
  selectOrdersByCoinId,
} from "../store/selectors";

export default function CoinDetails() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { data, isError, error, isLoading } = useCoinDetails(id);
  const {
    data: price,
    isError: isPriceError,
    error: priceError,
  } = useCoinPrices(id);

  const detailsErrorMessage = isError ? getRequestErrorMessage(error) : null;
  const priceErrorMessage = isPriceError
    ? getRequestErrorMessage(priceError)
    : null;

  const coinSymbol = data?.symbol ? data.symbol.toUpperCase() : "BTC";
  const ordersForCoin = useAppSelector((s) =>
    id ? selectOrdersByCoinId(s, id) : [],
  );
  const holding = useAppSelector((s) => (id ? selectHoldingForCoin(s, id) : 0));
  const eurBalance = useAppSelector(selectEurBalance);

  useEffect(() => {
    if (!data?.id) {
      return;
    }
    dispatch(
      recordCoinView({
        coinId: data.id,
        name: data.name,
        symbol: data.symbol.toUpperCase(),
        image: data.image.large,
      }),
    );
  }, [data, dispatch]);

  const priceChange = useMemo(() => {
    const priceChange = data?.market_data.price_change_24h_in_currency.eur ?? 0;
    if (priceChange > 0) {
      return {
        label: `+${priceChange.toLocaleString()} €`,
        className: "text-green-500",
      };
    }
    return {
      label: `${priceChange.toLocaleString()} €`,
      className: "text-red-500",
    };
  }, [data?.market_data.price_change_24h_in_currency.eur]);

  const MyHolding = useMemo(() => {
    return (
      <p className="mt-1 text-xs text-body text-right w-full">
        Available:
        <br />
        <span className="font-medium text-ink">
          {holding?.toLocaleString(undefined, {
            maximumFractionDigits: holding < 2 ? 6 : 2,
          })}{" "}
          <span className="font-semibold">{coinSymbol}</span>
          <br />
          {eurBalance} <span className="font-semibold">€</span>
        </span>
      </p>
    );
  }, [holding, eurBalance, coinSymbol]);

  const OrderHistory = useMemo(() => {
    return (
      <OrderHistoryList
        orders={ordersForCoin}
        emptyMessage={`No orders for ${coinSymbol} yet.`}
      />
    );
  }, [coinSymbol, ordersForCoin]);

  if (!id || !id.trim()) {
    return <Navigate to="/" />;
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {detailsErrorMessage}
      </div>
    );
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 md:flex-row md:gap-10">
      <div className="md:flex-1">
        <div className="flex w-full flex-col items-center md:items-start md:px-8">
          <div className="md:hidden w-full">{MyHolding}</div>
          <div className="hidden items-center gap-2 md:flex">
            <img src={data.image.large} alt={data.name} className="h-8 w-8" />
            <h1 className="text-2xl font-semibold text-body">
              {data.name} ({data.symbol?.toUpperCase()})
            </h1>
          </div>
          <h1 className="text-2xl font-semibold text-body md:hidden">
            {data.symbol?.toUpperCase()}
          </h1>
          <h2 className="text-2xl font-semibold text-body">
            {price ? (
              <AnimatedNumber
                key={id}
                value={price}
                suffix=" €"
                formatOptions={{
                  minimumFractionDigits: 2,
                  maximumFractionDigits: price < 2 ? 6 : 2,
                }}
              />
            ) : null}
          </h2>
          {priceErrorMessage && (
            <p className="mt-1 max-w-md text-center text-xs text-red-600 md:text-left">
              {priceErrorMessage}
            </p>
          )}
          <p className="mt-3 text-xs text-body md:mt-2">
            PnL:{" "}
            <span className={priceChange.className}>{priceChange.label}</span>
          </p>
        </div>

        <div className="mt-6 h-[260px] w-full md:h-[500px]">
          <Suspense
            fallback={
              <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-body">
                Loading chart…
              </div>
            }
          >
            <CoinLineChart id={id} />
          </Suspense>
        </div>
      </div>
      <CoinTradeModalButton
        coinId={id}
        coinSymbol={coinSymbol}
        priceEur={price}
        priceFetchError={priceErrorMessage}
        className="md:hidden"
      />
      <div className="md:hidden">{OrderHistory}</div>

      <div className="hidden flex-col gap-5 md:flex w-[330px]">
        <div className="">{MyHolding}</div>
        <div className="h-fit rounded-lg bg-gray-100 p-6">
          <CoinTradePanel
            coinId={id}
            coinSymbol={coinSymbol}
            priceEur={price}
            priceFetchError={priceErrorMessage}
          />
        </div>
        {OrderHistory}
      </div>
    </div>
  );
}
