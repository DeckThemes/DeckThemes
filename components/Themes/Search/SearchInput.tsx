import { DebounceInput } from "react-debounce-input";

export function SearchInput({ onSearchChange }: { onSearchChange?: (e: any) => any }) {
  return (
    <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-md p-2">
      <span>Search</span>
      <DebounceInput
        minLength={1}
        debounceTimeout={300}
        // @ts-ignore
        onChange={onSearchChange}
        className="bg-bgLight dark:bg-bgDark p-2 w-full h-12"
      />
    </div>
  );
}
