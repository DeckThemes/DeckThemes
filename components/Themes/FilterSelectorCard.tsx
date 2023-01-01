import { DebounceInput } from "react-debounce-input";
import Select from "react-select";
import { ReactSelectCustomLabel, ReactSelectCustomClasses } from "../CustomDropdowns";

export function FilterSelectorCard({
  filterOpts = ["ERROR"],
  orderOpts = ["ERROR"],
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
      .filter(([_, itemCount]) => Number(itemCount) > 0)
      .map(([filterName, itemCount]) => ({
        value: filterName,
        label: <ReactSelectCustomLabel mainText={filterName} bubbleValue={itemCount} />,
      })),
  ];
  const formattedOrderOpts = orderOpts.map((orderName) => ({
    value: orderName,
    label: <ReactSelectCustomLabel mainText={orderName} />,
  }));
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
            <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-3xl p-2">
              <span>Filter</span>
              <Select
                // This sets initial value to "All" if not pre-set
                value={
                  formattedFilterOpts.find((e) => e.value === filterValue) || formattedFilterOpts[0]
                }
                onChange={(e) => {
                  onFilterChange && onFilterChange({ target: e });
                }}
                {...ReactSelectCustomClasses}
                isSearchable={false}
                options={formattedFilterOpts}
              />
            </div>
            <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-3xl p-2">
              <span>Order</span>
              <Select
                value={
                  formattedOrderOpts.find((e) => e.value === orderValue) || formattedOrderOpts[0]
                }
                onChange={(e) => {
                  onOrderChange && onOrderChange({ target: e });
                }}
                maxMenuHeight={400}
                {...ReactSelectCustomClasses}
                isSearchable={false}
                options={formattedOrderOpts}
              />
            </div>
          </>
        )}
        <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-3xl p-2">
          <span>Search</span>
          <DebounceInput
            minLength={1}
            debounceTimeout={300}
            // @ts-ignore
            onChange={onSearchChange}
            className="bg-bgLight dark:bg-bgDark p-2 rounded-3xl w-full"
          />
        </div>
        {cssOrAudioValue !== undefined && (
          <>
            <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-3xl p-2">
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
