import { DebounceInput } from "react-debounce-input";

export function SearchInput({ onSearchChange }: { onSearchChange?: (e: any) => any }) {
  return (
    <div className="font-fancy text-sm flex flex-col rounded-md gap-2 flex-1">
      <div className="font-bold">Search</div>
      <DebounceInput
        minLength={1}
        debounceTimeout={300}
        // @ts-ignore
        onChange={onSearchChange}
        className="bg-bgLight dark:bg-base-3-dark border-2 border-borders-base1-dark rounded-xl p-2 w-full h-12"
      />
    </div>
  );
}
