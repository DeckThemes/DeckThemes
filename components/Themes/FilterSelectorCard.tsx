import { DebounceInput } from "react-debounce-input";
import Select from "react-select";
import { ReactSelectCustomLabel, ReactSelectCustomClasses } from "../CustomDropdowns";
import { FilterDropdown, OrderDropdown, SearchInput } from "./Search";
import { TypeDropdown } from "./Search/TypeDropdown";

export function FilterSelectorCard({
  filterOpts = ["ERROR"],
  orderOpts = ["ERROR"],
  showFiltersWithZero = false,
  searchValue = "",
  onFilterChange,
  onOrderChange,
  onSearchChange,
  cssOrAudioValue,
  onCSSAudioChange,
  filterValue,
  orderValue,
  searchOnly = false,
}: {
  filterOpts?: string[];
  filterValue: string;
  showFiltersWithZero?: boolean;
  orderOpts?: string[];
  orderValue: string;
  searchValue: string;
  onFilterChange?: (e: any) => void;
  onOrderChange?: (e: any) => void;
  onSearchChange?: (e: any) => any;
  cssOrAudioValue?: "CSS" | "AUDIO" | "" | undefined;
  onCSSAudioChange?: (e: any) => void;
  searchOnly?: boolean;
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 p-4 text-xl">
        {!searchOnly && (
          <>
            <FilterDropdown {...{ filterValue, filterOpts, onFilterChange, showFiltersWithZero }} />
            <OrderDropdown {...{ orderValue, onOrderChange, orderOpts }} />
          </>
        )}
        <SearchInput {...{ onSearchChange }} />
        <TypeDropdown
          typeValue={cssOrAudioValue}
          onTypeChange={onCSSAudioChange}
          typeOptions={[
            {
              value: "",
              displayText: "CSS & Audio",
            },
            {
              value: "CSS",
              displayText: "CSS",
            },
            {
              value: "AUDIO",
              displayText: "Audio",
            },
          ]}
        />
      </div>
    </>
  );
}
