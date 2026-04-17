import {
  COINGECKO_VS_CURRENCY_EUR,
  FIAT_CURRENCY_CODE_EUR,
} from "../constants/market";
import { useCoinsMarkets } from "../hooks/useCoinsMarkets";
import { getRequestErrorMessage } from "../lib/axios-error";
import { useAppSelector } from "../store/hooks";
import { selectRecentlyViewed } from "../store/selectors";
import { useNavbarSearchSuggestions } from "../hooks/useNavbarSearchSuggestions";
import { MarketsTable } from "../components/dashboard/MarketsTable";
import { TrendingList } from "../components/dashboard/TrendingList";
import { RecentList } from "../components/dashboard/RecentlyViewed";
import { DashboardSection } from "../components/dashboard/DashboardSection";

export default function Dashboard() {
  const recentlyViewed = useAppSelector(selectRecentlyViewed);
  const trendingQuery = useNavbarSearchSuggestions("");

  const marketsQuery = useCoinsMarkets({
    vs_currency: COINGECKO_VS_CURRENCY_EUR,
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
        <DashboardSection title="Trending">
          <TrendingList
            coins={trendingQuery.data}
            isLoading={trendingQuery.isLoading}
            errorMessage={trendingError}
          />
        </DashboardSection>
        <DashboardSection title="Recently viewed">
          <RecentList items={recentlyViewed} />
        </DashboardSection>
      </div>

      <DashboardSection
        title={`Top 100 by market cap (${FIAT_CURRENCY_CODE_EUR})`}
      >
        <MarketsTable
          rows={marketsQuery.data}
          isLoading={marketsQuery.isLoading}
          errorMessage={marketsError}
        />
      </DashboardSection>
    </div>
  );
}
