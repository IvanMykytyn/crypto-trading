import { OrderSide, type Order } from "../../store/ordersSlice";
import { formatCoinAmount, formatEurPrice } from "../../utils/currency";

type Props = {
  orders: Order[];
  emptyMessage?: string;
};

export function OrderHistoryList({ orders, emptyMessage }: Props) {
  if (orders.length === 0) {
    return (
      <p className="text-sm text-body">{emptyMessage ?? "No orders yet."}</p>
    );
  }

  return (
    <ul className="rounded-xl bg-[#F3F3F3] p-4">
      {orders.map((o) => (
        <li
          key={o.id}
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-0.5"
        >
          <p className="text-xs">
            {o.side === OrderSide.Buy ? "Buy" : "Sell"}{" "}
          </p>
          <p className="text-xs font-semibold">
            {formatCoinAmount(o.coinAmount)} {o.coinSymbol} /{" "}
            {formatEurPrice(o.eurAmount)}
          </p>
          <p className="text-xs">
            {new Date(o.createdAt).toLocaleTimeString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
