import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingCoins, searchCoins } from "../api/coingecko/search";
import { queryKeys } from "../constants/query-keys";
import {
  NAVBAR_SEARCH_DEBOUNCE_MS,
  STALE_TIME_MS,
} from "../constants/query-timing";

export function useNavbarSearchSuggestions(searchInput: string) {
  const trimmed = searchInput.trim();
  const [debouncedTrimmed] = useDebouncedValue(
    trimmed,
    NAVBAR_SEARCH_DEBOUNCE_MS,
    {
      leading: true,
    },
  );
  const querySearchValue = trimmed.length === 0 ? "" : debouncedTrimmed;

  return useQuery({
    queryKey: queryKeys.coingecko.navbarSuggestions(querySearchValue),
    queryFn: () =>
      querySearchValue.length === 0
        ? fetchTrendingCoins()
        : searchCoins(querySearchValue),
    staleTime: querySearchValue.length === 0 ? STALE_TIME_MS.navbarTrending : 0,
  });
}
