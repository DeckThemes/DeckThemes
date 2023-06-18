import { ReactSelectCustomClasses, ReactSelectCustomLabel } from "../../CustomDropdowns";
import Select from "react-select";

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
      label: (
        <ReactSelectCustomLabel
          mainText="All"
          bubbleValue={Object.values(filterOpts).reduce(
            (prev, cur) => Number(prev) + Number(cur),
            0
          )}
        />
      ),
    },
    ...Object.entries(filterOpts)
      .filter(([_, itemCount]) => Number(itemCount) > 0 || true)
      .map(([filterName, itemCount]) => ({
        value: filterName,
        label: (
          <ReactSelectCustomLabel
            // TODO: Refactor
            // This is a little bit of cursed logic that will convert target names like "Desktop-Library" to just "Library"
            mainText={
              typeValue &&
              typeValue?.toLowerCase()?.includes("desktop") &&
              filterName.toLowerCase().includes(`desktop-`)
                ? `${filterName.slice(filterName.indexOf("-") + 1)}`
                : filterName
            }
            bubbleValue={itemCount}
          />
        ),
      })),
  ];
  return (
    <>
      <div className="flex flex-col rounded-md gap-2">
        <span>Filter</span>
        <Select
          // This sets initial value to "All" if not pre-set
          value={formattedFilterOpts.find((e) => e.value === filterValue) || formattedFilterOpts[0]}
          onChange={(e) => {
            onFilterChange && onFilterChange({ target: e });
          }}
          {...ReactSelectCustomClasses}
          isSearchable={false}
          options={formattedFilterOpts}
        />
      </div>
    </>
  );
}
