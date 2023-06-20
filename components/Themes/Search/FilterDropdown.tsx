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
      displayText: "All",
      bubbleValue: Object.values(filterOpts).reduce(
        (prev, cur) => Number(prev) + Number(cur),
        0
      ),
    },
    ...Object.entries(filterOpts)
      .filter(([_, itemCount]) => Number(itemCount) > 0 || showFiltersWithZero)
      .map(([filterName, itemCount]) => ({
        value: filterName,
        displayText:
          typeValue === "DESKTOP-CSS" && filterName.includes("Desktop-")
            ? filterName.slice(filterName.indexOf("-") + 1)
            : filterName,
        bubbleValue: itemCount,
      })),
  ];
  return (
    <>
      <div className="font-fancy flex flex-col gap-2 rounded-md text-sm">
        <RadioDropdown
          headingText="Category"
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
