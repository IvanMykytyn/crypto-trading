import type { RecentCoinView } from "../../store/recentSlice";
import { ROUTE_PATH } from "../../constants/routes";
import { CoinRowLink } from "./CoinRowLink";

type Props = {
  items: RecentCoinView[];
};
export const RecentList: React.FC<Props> = ({ items }) => {
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
            to={ROUTE_PATH.coin(c.coinId)}
            imageUrl={c.image}
            name={c.name}
            symbol={c.symbol}
          />
        </li>
      ))}
    </ul>
  );
};
