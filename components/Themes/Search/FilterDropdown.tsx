import { RadioDropdown } from "../../Primitives";

export function FilterDropdown({
  filterOpts = ["ERROR"],
  typeValue,
  filterValue,
  showFiltersWithZero,
  onFilterChange,
}: {
  filterOpts?: string[];
  typeValue?: string;
  filterValue: string;
  showFiltersWithZero?: boolean;
  onFilterChange?: (e: any) => void;
}) {
  const formattedFilterOpts = [
    {
      value: "All",
      displayName: "All",
      bubbleValue: Object.values(filterOpts).reduce((prev, cur) => Number(prev) + Number(cur), 0),
    },
    ...Object.entries(filterOpts)
      .filter(([_, itemCount]) => Number(itemCount) > 0 || true)
      .map(([filterName, itemCount]) => ({
        value: filterName,
        displayName: filterName,
        bubbleValue: itemCount,
      })),
  ];
  return (
    <>
      <div className="flex flex-col rounded-md gap-2">
        <span>Filter</span>
        <RadioDropdown
          options={formattedFilterOpts}
          value={filterValue}
          onValueChange={(e: any) => {
            onFilterChange && onFilterChange(e);
          }}
        />
      </div>
    </>
  );
}
