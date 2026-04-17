import type { CoinSuggestion } from "../../api/coingecko/types";
import { ROUTE_PATH } from "../../constants/routes";
import { CoinRowLink } from "./CoinRowLink";

type Props = {
  coins: CoinSuggestion[] | undefined;
  isLoading: boolean;
  errorMessage: string | null;
};

export const TrendingList: React.FC<Props> = ({
  coins,
  isLoading,
  errorMessage,
}) => {
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
            to={ROUTE_PATH.coin(c.value)}
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
};
