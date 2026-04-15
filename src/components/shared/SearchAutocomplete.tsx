import { Autocomplete, Text } from "@mantine/core";
import type { AutocompleteProps, ComboboxGenericData } from "@mantine/core";

export type SearchAutocompleteProps = {
  data?: ComboboxGenericData;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSuggestionPick?: (value: string) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  renderOption?: AutocompleteProps["renderOption"];
};

export function SearchAutocomplete({
  data = [],
  placeholder = "Search…",
  value,
  defaultValue,
  onValueChange,
  onSuggestionPick,
  isLoading = false,
  errorMessage = null,
  renderOption,
}: SearchAutocompleteProps) {
  const items = [...data];

  return (
    <div>
      <Autocomplete
        placeholder={placeholder}
        data={items}
        value={value}
        defaultValue={defaultValue}
        onChange={(v) => onValueChange?.(v)}
        onOptionSubmit={(v) => onSuggestionPick?.(v)}
        size="sm"
        comboboxProps={{ shadow: "md" }}
        loadingPosition="right"
        loading={isLoading}
        clearable
        renderOption={renderOption}
      />
      {errorMessage ? (
        <Text size="xs" c="red" className="mt-1">
          {errorMessage}
        </Text>
      ) : null}
    </div>
  );
}
