import { ReactSelectCustomClasses, ReactSelectCustomLabel } from "../../CustomDropdowns";
import Select from "react-select";

export function FilterDropdown({
  filterOpts = ["ERROR"],
  filterValue,
  showFiltersWithZero,
  onFilterChange,
}: {
  filterOpts?: string[];
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
      .filter(([_, itemCount]) => Number(itemCount) > 0 || showFiltersWithZero)
      .map(([filterName, itemCount]) => ({
        value: filterName,
        label: <ReactSelectCustomLabel mainText={filterName} bubbleValue={itemCount} />,
      })),
  ];
  return (
    <>
      <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-md p-2">
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
