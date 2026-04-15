import type {
  ComboboxGenericItem,
  ComboboxLikeRenderOptionInput,
} from "@mantine/core";
import type { CoinSuggestion } from "../../api/coingecko/types";

export type NavbarSearchCoinOptionType =
  ComboboxLikeRenderOptionInput<ComboboxGenericItem>;
export const NavbarSearchCoinOption: React.FC<NavbarSearchCoinOptionType> = ({
  option,
}) => {
  const coin = option as CoinSuggestion;
  const rank = coin.marketCapRank != null ? `#${coin.marketCapRank}` : "—";

  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-3 p-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {coin.thumb ? (
          <img
            src={coin.thumb}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-md object-cover bg-search-well"
          />
        ) : (
          <div
            className="size-8 shrink-0 rounded-md bg-search-well"
            aria-hidden
          />
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-ink">
            {coin.name}
          </div>
          <div className="truncate text-xs text-body">{coin.symbol}</div>
        </div>
      </div>
      <div className="shrink-0 tabular-nums text-xs text-body">{rank}</div>
    </div>
  );
};
