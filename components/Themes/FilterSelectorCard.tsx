import { DebounceInput } from "react-debounce-input";
import Select from "react-select";
import { ReactSelectCustomLabel, ReactSelectCustomClasses } from "../CustomDropdowns";
import { FilterDropdown, OrderDropdown, SearchInput } from "./Search";

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
  const formattedCssAudioOpts = [
    {
      value: "",
      label: <ReactSelectCustomLabel mainText="CSS & Audio" />,
    },
    {
      value: "CSS",
      label: <ReactSelectCustomLabel mainText="CSS" />,
    },
    {
      value: "AUDIO",
      label: <ReactSelectCustomLabel mainText="Audio" />,
    },
  ];
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
        {cssOrAudioValue !== undefined && (
          <>
            <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-md p-2">
              <span>Type</span>
              <Select
                value={
                  formattedCssAudioOpts.find((e) => e.value === cssOrAudioValue) ||
                  formattedCssAudioOpts[0]
                }
                onChange={(e) => {
                  onCSSAudioChange && onCSSAudioChange({ target: e });
                }}
                maxMenuHeight={400}
                {...ReactSelectCustomClasses}
                isSearchable={false}
                options={formattedCssAudioOpts}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
