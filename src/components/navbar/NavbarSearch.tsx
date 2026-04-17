import { useState } from "react";
import { useNavbarSearchSuggestions } from "../../hooks/useNavbarSearchSuggestions";
import { getRequestErrorMessage } from "../../lib/axios-error";
import { SearchAutocomplete } from "../shared/SearchAutocomplete";
import {
  NavbarSearchCoinOption,
  type NavbarSearchCoinOptionType,
} from "./NavbarSearchCoinOption";
import { useNavigate } from "react-router";
import { ROUTE_PATH } from "../../constants/routes";

export function NavbarSearch() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const { data, isError, error, isPending, isFetching } =
    useNavbarSearchSuggestions(value);
  const errorMessage = isError ? getRequestErrorMessage(error) : null;
  const isLoading = isPending || isFetching;

  return (
    <SearchAutocomplete
      placeholder="Search..."
      value={value}
      onValueChange={setValue}
      data={data ?? []}
      onSuggestionPick={(value) => {
        navigate(ROUTE_PATH.coin(value));
      }}
      isLoading={isLoading}
      errorMessage={errorMessage}
      renderOption={({ option }: NavbarSearchCoinOptionType) => {
        return <NavbarSearchCoinOption option={option} />;
      }}
    />
  );
}
