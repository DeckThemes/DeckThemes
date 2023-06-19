import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useContext, useMemo } from "react";
import { themeContext } from "../../styles";
import { MdKeyboardArrowDown } from "react-icons/md";
import { twMerge } from "tailwind-merge";
import { BsDot } from "react-icons/bs";

// This primitive accepts either an array of {value: string, displayName: string, bubbleValue: string | number}
// Or, just an array of {value: string}
// Doubly-Or, just a string array
// This allows for ones with custom display text, or just simple ones
// TODO: allow this to just accept a single string arr and still work

export function RadioDropdown({
  options,
  value,
  onValueChange,
  triggerClass = "",
}: {
  options: { value: string; displayText?: string; bubbleValue?: string | number }[] | string[];
  value: string;
  onValueChange: any;
  triggerClass?: string;
}) {
  const formattedOptions = useMemo(() => {
    if (typeof options[0] === "string") {
      return options.map((e) => ({
        value: e,
        displayText: e,
        bubbleValue: undefined,
      }));
    }
    // God they need to hook typescript up to a brain interface so it can learn THIS IS INTENDED
    return options.map((e) => ({
      // @ts-ignore
      value: e.value,
      // @ts-ignore
      displayText: e?.displayText || e.value,
      // @ts-ignore
      bubbleValue: e?.bubbleValue ?? undefined,
    }));
  }, [options]);

  const { theme } = useContext(themeContext);
  const selected = useMemo(
    () => formattedOptions.find((e: any) => e.value === value) || formattedOptions[0],
    [formattedOptions, value]
  );
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={twMerge(
          "h-12 flex items-center rounded-xl justify-center px-4 bg-base-3-light dark:bg-base-3-dark min-w-[250px] border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition-all",
          triggerClass
        )}
      >
        <>
          <div className="text-sm flex flex-1 h-full justify-between items-center w-fit">
            <span>{selected?.displayText || selected?.value}</span>
            {formattedOptions.reduce(
              (prev, cur) => (cur?.bubbleValue || prev ? true : false),
              false
            ) && (
              <span className="rounded-full flex items-center justify-center pr-2">
                {selected?.bubbleValue}
              </span>
            )}
          </div>
          <MdKeyboardArrowDown />
        </>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <div className={`${theme}`}>
          <DropdownMenu.Content className="z-[9999] text-sm radio-dropdown font-fancy select-none cursor-default overflow-hidden bg-base-3-light dark:bg-base-3-dark w-[250px] text-black dark:text-white rounded-xl border-2 border-borders-base2-light dark:border-borders-base2-dark transition-all">
            <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
              {formattedOptions.map((e) => (
                <DropdownMenu.RadioItem
                  value={e.value}
                  key={e.value}
                  className="flex items-center justify-center px-4 pl-8 py-2 relative hover:bg-brandBlue dark:hover:bg-brandBlue focus:bg-brandBlue dark:focus:bg-brandBlue outline-none m-1 rounded-lg"
                >
                  <DropdownMenu.ItemIndicator className="absolute -left-1 top-1/2 -translate-y-1/2">
                    <BsDot size={36} />
                  </DropdownMenu.ItemIndicator>
                  <div className="w-full flex items-center justify-between gap-2">
                    <span className="font-semibold w-fit flex items-center">
                      {e?.displayText || e.value}
                    </span>
                    {e.bubbleValue !== undefined && (
                      <span className="font-semibold ">{e.bubbleValue}</span>
                    )}
                  </div>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </div>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
