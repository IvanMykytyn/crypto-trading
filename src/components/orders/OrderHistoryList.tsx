import type { Order } from "../../store/ordersSlice";

type Props = {
  orders: Order[];
  emptyMessage?: string;
};

function formatEur(n: number): string {
  return `${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

function formatCoin(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: n < 2 ? 6 : 3 });
}

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
          <p className="text-xs">{o.side === "buy" ? "Buy" : "Sell"} </p>
          <p className="text-xs font-semibold">
            {formatCoin(o.coinAmount)} {o.coinSymbol} / {formatEur(o.eurAmount)}
          </p>
          <p className="text-xs">
            {new Date(o.createdAt).toLocaleTimeString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
