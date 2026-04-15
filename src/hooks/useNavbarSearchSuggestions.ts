import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchTrendingCoins, searchCoins } from "../api/coingecko/search";

const DEBOUNCE_MS = 300;

export function useNavbarSearchSuggestions(searchInput: string) {
  const trimmed = searchInput.trim();
  const [debouncedTrimmed] = useDebouncedValue(trimmed, DEBOUNCE_MS, {
    leading: true,
  });
  const querySearchValue = trimmed.length === 0 ? "" : debouncedTrimmed;

  return useQuery({
    queryKey: ["coingecko", "navbar-suggestions", querySearchValue],
    queryFn: () =>
      querySearchValue.length === 0
        ? fetchTrendingCoins()
        : searchCoins(querySearchValue),
    staleTime: querySearchValue.length === 0 ? 300000 : 0, // 5 minutes
  });
}
