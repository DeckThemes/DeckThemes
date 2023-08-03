import { LabelledInput } from "@components/Primitives";
import { FilterDropdown, OrderDropdown, TypeDropdown, TypeOptions } from ".";
import { useVW } from "@hooks/useVW";
import { useState } from "react";

export function FilterSelectorCard({
  filterOpts = ["ERROR"],
  orderOpts = ["ERROR"],
  showFiltersWithZero = false,
  searchValue = "",
  onFilterChange,
  onOrderChange,
  onSearchChange,
  typeOptions,
  typeValue,
  onTypeChange,
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
  typeOptions: TypeOptions;
  typeValue?: string | undefined;
  onFilterChange?: (e: any) => void;
  onOrderChange?: (e: any) => void;
  onSearchChange?: (e: any) => any;
  onTypeChange?: (e: any) => void;
  searchOnly?: boolean;
}) {
  const vw = useVW(true);
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);

  const toggleFiltersExpanded = () => {
    setFiltersExpanded(!filtersExpanded);
  };
  return (
    <>
      <div className="relative flex w-full max-w-7xl flex-col items-center gap-4 py-4 lg:flex-row">
        <LabelledInput
          label="Search"
          debounce
          value={searchValue}
          onValueChange={(e) => onSearchChange && onSearchChange(e)}
        />
        {vw <= 1025 ? (
          <>
            <button
              onClick={toggleFiltersExpanded}
              className="flex h-fit w-fit select-none items-center gap-2 whitespace-nowrap rounded-full border border-borders-base3-dark py-2 px-4 text-sm font-bold transition duration-150  hover:scale-95 hover:bg-base-3-dark hover:active:scale-90"
            >
              {filtersExpanded ? "Hide Filters" : "Show Filters"}
            </button>
            {/* could definitely use some cleanup, but this is "good enough" for now */}
            {filtersExpanded && (
              <>
                <div className="mobile-filter-animate-in flex w-full flex-col gap-4 overflow-hidden">
                  {typeOptions !== undefined && (
                    <TypeDropdown
                      typeValue={typeValue}
                      onTypeChange={onTypeChange}
                      typeOptions={typeOptions}
                    />
                  )}

                  {!searchOnly && (
                    <>
                      <FilterDropdown
                        {...{
                          filterValue,
                          filterOpts,
                          onFilterChange,
                          showFiltersWithZero,
                          typeValue,
                        }}
                      />
                      <OrderDropdown {...{ orderValue, onOrderChange, orderOpts }} />
                    </>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="hidden md:flex md:flex-row md:gap-4">
              {typeOptions !== undefined && (
                <TypeDropdown
                  typeValue={typeValue}
                  onTypeChange={onTypeChange}
                  typeOptions={typeOptions}
                />
              )}

              {!searchOnly && (
                <>
                  <FilterDropdown
                    {...{
                      filterValue,
                      filterOpts,
                      onFilterChange,
                      showFiltersWithZero,
                      typeValue,
                    }}
                  />
                  <OrderDropdown {...{ orderValue, onOrderChange, orderOpts }} />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
