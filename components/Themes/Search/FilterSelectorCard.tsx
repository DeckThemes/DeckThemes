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
      <div className="flex flex-col md:flex-row gap-2 p-4 text-xl">
        {!searchOnly && (
          <>
            <FilterDropdown
              {...{ filterValue, filterOpts, onFilterChange, showFiltersWithZero, typeValue }}
            />
            <OrderDropdown {...{ orderValue, onOrderChange, orderOpts }} />
          </>
        )}
        <SearchInput {...{ onSearchChange }} />
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
