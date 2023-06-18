import { FilterDropdown, OrderDropdown, SearchInput, TypeDropdown, TypeOptions } from ".";

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
  return (
    <>
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-2 my-4 text-xl">
	  	<SearchInput {...{ onSearchChange }} />
        {!searchOnly && (
          <>
            <FilterDropdown
              {...{ filterValue, filterOpts, onFilterChange, showFiltersWithZero, typeValue }}
            />
            <OrderDropdown {...{ orderValue, onOrderChange, orderOpts }} />
          </>
        )}
        {typeOptions !== undefined && (
          <TypeDropdown
            typeValue={typeValue}
            onTypeChange={onTypeChange}
            typeOptions={typeOptions}
          />
        )}
      </div>
    </>
  );
}
