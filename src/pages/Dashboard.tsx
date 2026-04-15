import { Link } from "react-router";

import type { CoinMarketListItem } from "../api/coingecko/markets";
import type { CoinSuggestion } from "../api/coingecko/types";
import { useCoinsMarkets } from "../hooks/useCoinsMarkets";
import { getRequestErrorMessage } from "../lib/axios-error";
import { useAppSelector } from "../store/hooks";
import { selectRecentlyViewed } from "../store/selectors";
import type { RecentCoinView } from "../store/recentSlice";
import { useNavbarSearchSuggestions } from "../hooks/useNavbarSearchSuggestions";

function formatEurPrice(n: number | null | undefined): string {
  if (n == null) {
    return "—";
  }
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: n >= 1 ? 2 : 6,
  });
}

function formatCompactEur(n: number | null | undefined): string {
  if (n == null) {
    return "—";
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function CoinRowLink({
  to,
  imageUrl,
  name,
  symbol,
  trailing,
}: {
  to: string;
  imageUrl?: string | null;
  name: string;
  symbol: string;
  trailing?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex w-full min-w-0 items-center justify-between gap-3 rounded-md p-2 transition-colors hover:bg-neutral-50"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-md object-cover bg-neutral-100"
          />
        ) : (
          <div
            className="size-8 shrink-0 rounded-md bg-neutral-100"
            aria-hidden
          />
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-ink">{name}</div>
          <div className="truncate text-xs text-body">{symbol}</div>
        </div>
      </div>
      {trailing != null ? (
        <div className="shrink-0 tabular-nums text-xs text-body">
          {trailing}
        </div>
      ) : null}
    </Link>
  );
}

function TrendingList({
  coins,
  isLoading,
  errorMessage,
}: {
  coins: CoinSuggestion[] | undefined;
  isLoading: boolean;
  errorMessage: string | null;
}) {
  if (isLoading) {
    return <p className="text-sm text-body">Loading…</p>;
  }
  if (errorMessage) {
    return <p className="text-sm text-red-600">{errorMessage}</p>;
  }
  if (!coins?.length) {
    return <p className="text-sm text-body">No trending coins.</p>;
  }
  return (
    <ul className="divide-y divide-neutral-100 max-h-[275px] overflow-y-auto">
      {coins.map((c) => (
        <li key={c.value}>
          <CoinRowLink
            to={`/coin/${c.value}`}
            imageUrl={c.thumb}
            name={c.name}
            symbol={c.symbol}
            trailing={
              c.marketCapRank != null ? `#${c.marketCapRank}` : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
}

function RecentList({ items }: { items: RecentCoinView[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-body">
        Open a coin page to add up to five recently viewed coins.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-neutral-100 max-h-[275px] overflow-y-auto">
      {items.map((c) => (
        <li key={c.coinId}>
          <CoinRowLink
            to={`/coin/${c.coinId}`}
            imageUrl={c.image}
            name={c.name}
            symbol={c.symbol}
          />
        </li>
      ))}
    </ul>
  );
}

function pctChangeClass(pct: number | null | undefined): string {
  if (pct == null) {
    return "text-body";
  }
  if (pct > 0) {
    return "text-green-600";
  }
  if (pct < 0) {
    return "text-red-600";
  }
  return "text-body";
}

function MarketsTable({
  rows,
  isLoading,
  errorMessage,
}: {
  rows: CoinMarketListItem[] | undefined;
  isLoading: boolean;
  errorMessage: string | null;
}) {
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
                    to={`/coin/${row.id}`}
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
}

export default function Dashboard() {
  const recentlyViewed = useAppSelector(selectRecentlyViewed);
  const trendingQuery = useNavbarSearchSuggestions("");

  const marketsQuery = useCoinsMarkets({
    vs_currency: "eur",
    per_page: 100,
    page: 1,
  });

  const trendingError = trendingQuery.isError
    ? getRequestErrorMessage(trendingQuery.error)
    : null;

  const marketsError = marketsQuery.isError
    ? getRequestErrorMessage(marketsQuery.error)
    : null;

  return (
    <div className="space-y-6">
      <div
        role="status"
        className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950"
      >
        <p className="font-medium text-sky-950">API note</p>
        <p className="mt-1 text-sky-900/90">
          You might see occasional network or rate-limit errors: the free public
          API is limited to about 30 requests per minute, so rapid navigation or
          refreshes can hit that cap.
        </p>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-body">
          Trending, your recently viewed coins, and top listings by market cap.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Trending">
          <TrendingList
            coins={trendingQuery.data}
            isLoading={trendingQuery.isLoading}
            errorMessage={trendingError}
          />
        </Section>
        <Section title="Recently viewed">
          <RecentList items={recentlyViewed} />
        </Section>
      </div>

      <Section title="Top 100 by market cap (EUR)">
        <MarketsTable
          rows={marketsQuery.data}
          isLoading={marketsQuery.isLoading}
          errorMessage={marketsError}
        />
      </Section>
    </div>
  );
}
