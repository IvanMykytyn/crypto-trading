import { useEffect } from "react";
import { Navigate, useParams } from "react-router";

import { COINGECKO_VS_CURRENCY_EUR } from "../constants/market";
import { ROUTE_PATH } from "../constants/routes";
import { CoinTradeModalButton } from "../components/coins/coin-trade-panel/CoinTradeModalButton";
import { CoinDetailsChart } from "../components/coins/coin-details/CoinDetailsChart";
import {
  CoinDetailsErrorBanner,
  CoinDetailsPageLoading,
} from "../components/coins/coin-details/CoinDetailsStatus";
import { CoinDetailsSidebar } from "../components/coins/coin-details/CoinDetailsSidebar";
import { CoinDetailsTitleAndPrice } from "../components/coins/coin-details/CoinDetailsTitleAndPrice";
import { CoinHoldingSummary } from "../components/coins/coin-details/CoinHoldingSummary";
import { OrderHistoryList } from "../components/orders/OrderHistoryList";
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
  const holding = useAppSelector((s) => (id ? selectHoldingForCoin(s, id) : 0));
  const eurBalance = useAppSelector(selectEurBalance);
  const ordersForCoin = useAppSelector((s) =>
    id ? selectOrdersByCoinId(s, id) : [],
  );

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
  const priceChangeEur =
    data?.market_data.price_change_24h_in_currency[COINGECKO_VS_CURRENCY_EUR] ??
    0;

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

  if (!id || !id.trim()) {
    return <Navigate to={ROUTE_PATH.home} />;
  }

  if (isError) {
    return <CoinDetailsErrorBanner message={detailsErrorMessage ?? ""} />;
  }

  if (isLoading) {
    return <CoinDetailsPageLoading />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col gap-6 md:flex-row md:gap-10">
      <div className="md:flex-1">
        <div className="flex w-full flex-col items-center md:items-start md:px-8">
          <div className="w-full md:hidden">
            <CoinHoldingSummary
              holding={holding}
              eurBalance={eurBalance}
              coinSymbol={coinSymbol}
            />
          </div>
          <CoinDetailsTitleAndPrice
            coinId={id}
            name={data.name}
            symbolUpper={data.symbol.toUpperCase()}
            imageLarge={data.image.large}
            price={price}
            priceErrorMessage={priceErrorMessage}
            priceChangeEur={priceChangeEur}
          />
        </div>

        <CoinDetailsChart coinId={id} />
      </div>

      <CoinTradeModalButton
        coinId={id}
        coinSymbol={coinSymbol}
        priceEur={price}
        priceFetchError={priceErrorMessage}
        className="md:hidden"
      />

      <div className="md:hidden">
        <OrderHistoryList
          orders={ordersForCoin}
          emptyMessage={`No orders for ${coinSymbol} yet.`}
        />
      </div>

      <CoinDetailsSidebar
        coinId={id}
        coinSymbol={coinSymbol}
        priceEur={price}
        priceFetchError={priceErrorMessage}
        holding={holding}
        eurBalance={eurBalance}
        orders={ordersForCoin}
      />
    </div>
  );
}
