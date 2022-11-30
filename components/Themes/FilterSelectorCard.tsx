import EventEmitter from "events";

export function FilterSelectorCard({
  filterOpts = ["ERROR"],
  orderOpts = ["ERROR"],
  searchValue = "",
  onFilterChange,
  onOrderChange,
  onSearchChange,
  searchOnly = false,
}: {
  filterOpts?: string[];
  orderOpts?: string[];
  searchValue: string;
  onFilterChange?: (e: any) => void;
  onOrderChange?: (e: any) => void;
  onSearchChange?: (e: any) => void;
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
              >
                <option value="All">All</option>
                {filterOpts.map((e) => {
                  return (
                    <option value={e} key={`Your Themes Filter ${e}`}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-3xl p-2"
              onChange={onOrderChange}
            >
              <span>Order</span>
              <select className="bg-bgLight dark:bg-bgDark rounded-3xl p-2 px-4">
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
          <input
            type="text"
            value={searchValue}
            onChange={onSearchChange}
            className="bg-bgLight dark:bg-bgDark p-2 rounded-3xl w-full"
          />
        </div>
      </div>
    </>
  );
}
