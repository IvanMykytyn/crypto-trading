import { Link } from "react-router";
import type { CoinMarketListItem } from "../../api/coingecko/markets";
import { ROUTE_PATH } from "../../constants/routes";
import { formatCompactEur, formatEurPrice } from "../../utils/currency";
import { pctChangeClass } from "./utils";

type Props = {
  rows: CoinMarketListItem[] | undefined;
  isLoading: boolean;
  errorMessage: string | null;
};

export const MarketsTable: React.FC<Props> = ({
  rows,
  isLoading,
  errorMessage,
}) => {
  if (isLoading) {
    return <p className="text-sm text-body">Loading…</p>;
  }
  if (errorMessage) {
    return <p className="text-sm text-red-600">{errorMessage}</p>;
  }
  if (!rows?.length) {
    return <p className="text-sm text-body">No market data.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-xs text-body">
            <th className="py-2 pr-2 font-medium">#</th>
            <th className="py-2 pr-2 font-medium">Coin</th>
            <th className="py-2 pr-2 text-right font-medium">Price</th>
            <th className="py-2 pr-2 text-right font-medium">24h</th>
            <th className="py-2 pr-2 text-right font-medium">Mkt cap</th>
            <th className="py-2 text-right font-medium">Volume</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const pct = row.price_change_percentage_24h;
            const pctLabel =
              pct == null ? "—" : `${pct > 0 ? "+" : ""}${pct.toFixed(2)}%`;
            return (
              <tr
                key={row.id}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="py-2 pr-2 tabular-nums text-body">
                  {row.market_cap_rank ?? "—"}
                </td>
                <td className="py-2 pr-2">
                  <Link
                    to={ROUTE_PATH.coin(row.id)}
                    className="flex min-w-0 items-center gap-2 hover:underline"
                  >
                    {row.image ? (
                      <img
                        src={row.image}
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 rounded-md object-cover"
                      />
                    ) : null}
                    <span className="truncate font-medium text-ink">
                      {row.name}
                    </span>
                    <span className="shrink-0 text-xs uppercase text-body">
                      {row.symbol}
                    </span>
                  </Link>
                </td>
                <td className="py-2 pr-2 text-right tabular-nums text-ink">
                  {formatEurPrice(row.current_price)}
                </td>
                <td
                  className={`py-2 pr-2 text-right tabular-nums ${pctChangeClass(pct)}`}
                >
                  {pctLabel}
                </td>
                <td className="py-2 pr-2 text-right tabular-nums text-body">
                  {formatCompactEur(row.market_cap)}
                </td>
                <td className="py-2 text-right tabular-nums text-body">
                  {formatCompactEur(row.total_volume)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
