import { DebounceInput } from "react-debounce-input";

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
  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 p-4 text-xl">
        {!searchOnly && (
          <>
            <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-3xl p-2">
              <span>Filter</span>
              <select
                className="bg-bgLight dark:bg-bgDark rounded-3xl p-2 px-4"
                onChange={onFilterChange}
                value={filterValue}
              >
                <option value="All">All</option>
                {filterOpts.map((e) => {
                  return (
                    <option value={e} key={`Your Themes Filter ${e}`}>
                      {e !== "AwaitingApproval" ? e : "Awaiting Approval"}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-3xl p-2">
              <span>Order</span>
              <select
                className="bg-bgLight dark:bg-bgDark rounded-3xl p-2 px-4"
                onChange={onOrderChange}
                value={orderValue}
              >
                {orderOpts.map((e) => {
                  return (
                    <option value={e} key={`Your Themes Filter ${e}`}>
                      {e}
                    </option>
                  );
                })}
              </select>
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
              <select
                className="bg-bgLight dark:bg-bgDark rounded-3xl p-2 px-4"
                onChange={onCSSAudioChange}
                value={cssOrAudioValue}
              >
                <option value="">CSS & Audio</option>
                <option value="CSS">CSS Theme</option>
                <option value="AUDIO">Audio Pack</option>
              </select>
            </div>
          </>
        )}
      </div>
    </>
  );
}
