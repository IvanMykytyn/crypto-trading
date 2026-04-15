import { clsx } from "clsx";

import type { CoinPosition } from "../../store/positionsFromOrders";

type Props = {
  positions: Record<string, CoinPosition>;
  /** CoinGecko id → display symbol (e.g. from latest order). */
  symbolByCoinId: Record<string, string>;
  /** CoinGecko simple/price map: id → { eur: number } */
  priceById: Record<string, { eur?: number }> | undefined;
  isLoadingPrices: boolean;
  /** Human-readable error when the batched price request failed. */
  pricesErrorMessage?: string | null;
};

function fmtEur(n: number, digits = 2): string {
  return `${n.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} €`;
}

function fmtPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}%`;
}

export function CoinPositionsTable({
  positions,
  symbolByCoinId,
  priceById,
  isLoadingPrices,
  pricesErrorMessage = null,
}: Props) {
  const safePositions = positions ?? {};
  const rows = Object.entries(safePositions).filter(([, p]) => p.quantity > 0);

  if (rows.length === 0) {
    return <p className="text-sm text-body">No coin holdings yet.</p>;
  }

  /** Totals only for rows with a live quote so value / cost / P/L line up. */
  let sumCostQuoted = 0;
  let sumValue = 0;
  let sumPnl = 0;

  const computed = rows.map(([coinId, pos]) => {
    const symbol = symbolByCoinId[coinId] ?? coinId.toUpperCase();
    const costBasis = pos.quantity * pos.avgCostEurPerCoin;
    const priceEur = priceById?.[coinId]?.eur;
    const hasLive = typeof priceEur === "number" && Number.isFinite(priceEur);
    const marketValue = hasLive ? pos.quantity * priceEur : null;
    const unrealizedEur = marketValue !== null ? marketValue - costBasis : null;
    const unrealizedPct =
      costBasis > 0 && unrealizedEur !== null
        ? (unrealizedEur / costBasis) * 100
        : null;

    if (marketValue !== null) {
      sumCostQuoted += costBasis;
      sumValue += marketValue;
      sumPnl += unrealizedEur ?? 0;
    }

    return {
      coinId,
      symbol,
      pos,
      costBasis,
      priceEur: hasLive ? priceEur : null,
      marketValue,
      unrealizedEur,
      unrealizedPct,
    };
  });

  const header =
    "text-left text-xs font-semibold uppercase tracking-wide text-body";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs text-body">
        {isLoadingPrices && <span>Loading market prices…</span>}
        {pricesErrorMessage && (
          <span className="text-red-600">{pricesErrorMessage}</span>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className={clsx(header, "px-3 py-2")}>Asset</th>
              <th className={clsx(header, "px-3 py-2 text-right")}>Quantity</th>
              <th className={clsx(header, "px-3 py-2 text-right")}>Avg cost</th>
              <th className={clsx(header, "px-3 py-2 text-right")}>Price</th>
              <th className={clsx(header, "px-3 py-2 text-right")}>Value</th>
              <th className={clsx(header, "px-3 py-2 text-right")}>
                Cost basis
              </th>
              <th className={clsx(header, "px-3 py-2 text-right")}>
                Unrealized
              </th>
              <th className={clsx(header, "px-3 py-2 text-right")}>%</th>
            </tr>
          </thead>
          <tbody>
            {computed.map(
              ({
                coinId,
                symbol,
                pos,
                costBasis,
                priceEur,
                marketValue,
                unrealizedEur,
                unrealizedPct,
              }) => (
                <tr
                  key={coinId}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-3 py-2.5">
                    <span className="font-medium text-ink">{symbol}</span>
                    <span className="mt-0.5 block font-mono text-[11px] text-body">
                      {coinId}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-ink">
                    {pos.quantity.toLocaleString(undefined, {
                      maximumFractionDigits: 8,
                    })}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-body">
                    {fmtEur(pos.avgCostEurPerCoin)}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-body">
                    {priceEur !== null ? fmtEur(priceEur) : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-ink">
                    {marketValue !== null ? fmtEur(marketValue) : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-body">
                    {fmtEur(costBasis)}
                  </td>
                  <td
                    className={clsx(
                      "px-3 py-2.5 text-right font-medium tabular-nums",
                      unrealizedEur === null
                        ? "text-body"
                        : unrealizedEur > 0
                          ? "text-green-600"
                          : unrealizedEur < 0
                            ? "text-red-600"
                            : "text-ink",
                    )}
                  >
                    {unrealizedEur !== null ? fmtEur(unrealizedEur) : "—"}
                  </td>
                  <td
                    className={clsx(
                      "px-3 py-2.5 text-right tabular-nums",
                      unrealizedPct === null
                        ? "text-body"
                        : unrealizedPct > 0
                          ? "text-green-600"
                          : unrealizedPct < 0
                            ? "text-red-600"
                            : "text-ink",
                    )}
                  >
                    {unrealizedPct !== null ? fmtPct(unrealizedPct) : "—"}
                  </td>
                </tr>
              ),
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50 font-medium">
              <td className="px-3 py-2.5 text-ink" colSpan={4}>
                Subtotal (rows with a live price)
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-ink">
                {sumValue > 0 ? fmtEur(sumValue) : "—"}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-body">
                {sumCostQuoted > 0 ? fmtEur(sumCostQuoted) : "—"}
              </td>
              <td
                className={clsx(
                  "px-3 py-2.5 text-right tabular-nums",
                  sumPnl > 0
                    ? "text-green-600"
                    : sumPnl < 0
                      ? "text-red-600"
                      : "text-ink",
                )}
              >
                {sumCostQuoted > 0 ? fmtEur(sumPnl) : "—"}
              </td>
              <td className="px-3 py-2.5 text-right tabular-nums text-body">
                {sumCostQuoted > 0
                  ? fmtPct((sumPnl / sumCostQuoted) * 100)
                  : "—"}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-xs text-body">
        Unrealized P/L uses your average entry price vs the latest CoinGecko EUR
        quote. Selling does not change the average cost of what you still hold.
      </p>
    </div>
  );
}
