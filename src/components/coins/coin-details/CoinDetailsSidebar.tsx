import type { Order } from "../../../store/ordersSlice";
import { CoinTradePanel } from "../coin-trade-panel/CoinTradePanel";
import { OrderHistoryList } from "../../orders/OrderHistoryList";
import { CoinHoldingSummary } from "./CoinHoldingSummary";

type Props = {
  coinId: string;
  coinSymbol: string;
  priceEur: number | undefined;
  priceFetchError: string | null;
  holding: number;
  eurBalance: number;
  orders: Order[];
};

export function CoinDetailsSidebar({
  coinId,
  coinSymbol,
  priceEur,
  priceFetchError,
  holding,
  eurBalance,
  orders,
}: Props) {
  return (
    <div className="hidden w-[330px] flex-col gap-5 md:flex">
      <CoinHoldingSummary
        holding={holding}
        eurBalance={eurBalance}
        coinSymbol={coinSymbol}
      />
      <div className="h-fit rounded-lg bg-gray-100 p-6">
        <CoinTradePanel
          coinId={coinId}
          coinSymbol={coinSymbol}
          priceEur={priceEur}
          priceFetchError={priceFetchError}
        />
      </div>
      <OrderHistoryList
        orders={orders}
        emptyMessage={`No orders for ${coinSymbol} yet.`}
      />
    </div>
  );
}
