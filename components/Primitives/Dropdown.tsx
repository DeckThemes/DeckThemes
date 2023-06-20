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
  headingText,
  headingClass = "",
}: {
  options:
    | { value: string; displayText?: string; bubbleValue?: string | number; disabled?: boolean }[]
    | string[];
  value: string;
  onValueChange: (e: string) => void;
  triggerClass?: string;
  headingText?: string;
  headingClass?: string;
}) {
  const formattedOptions = useMemo(() => {
    if (typeof options[0] === "string") {
      return options.map((e) => ({
        value: e,
        displayText: e,
        bubbleValue: undefined,
        disabled: false,
      }));
    }
    // God they need to hook typescript up to a brain interface so it can learn THIS IS INTENDED
    // TODO: figure out the typerrors
    return options.map((e) => ({
      // @ts-ignore
      value: e.value,
      // @ts-ignore
      displayText: e?.displayText || e.value,
      // @ts-ignore
      bubbleValue: e?.bubbleValue ?? undefined,
      // @ts-ignore
      disabled: e?.disabled ?? false,
    }));
  }, [options]);

  const { theme } = useContext(themeContext);
  const selected = useMemo(
    () => formattedOptions.find((e: any) => e.value === value) || formattedOptions[0],
    [formattedOptions, value]
  );
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="w-full flex flex-col gap-2">
        {headingText && (
          <span className={twMerge("font-bold w-full text-left", headingClass)}>{headingText}</span>
        )}
        <div
          className={twMerge(
            "h-12 flex items-center rounded-xl justify-center px-4 bg-base-3-light dark:bg-base-3-dark min-w-[250px] border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition-all",
            triggerClass
          )}
        >
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
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <div className={`${theme} contents`}>
			{/* bg-base-3-light dark:bg-base-3-dark w-[250px] text-black dark:text-white rounded-xl border-2 border-borders-base2-light dark:border-borders-base2-dark  */}
          <DropdownMenu.Content avoidCollisions collisionPadding={16} className="z-[9999] h-max overflow-y-auto text-sm font-fancy select-none cursor-default overflow-hidden transition-all radio-dropdown bg-base-3-light dark:bg-base-3-dark w-[250px] text-black dark:text-white rounded-xl my-1">
            <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
				<div className="max-h-[var(--radix-popper-available-height)]">
				{formattedOptions.map((e) => (
                <DropdownMenu.RadioItem
                  disabled={e.disabled}
                  value={e.value}
                  key={e.value}
                  className="flex items-center justify-center px-4 pl-8 py-2 relative hover:bg-brandBlue dark:hover:bg-brandBlue focus:bg-brandBlue dark:focus:bg-brandBlue outline-none m-1 rounded-lg"
                >
                  <DropdownMenu.ItemIndicator className="absolute -left-1 top-1/2 -translate-y-1/2">
                    <BsDot size={36} />
                  </DropdownMenu.ItemIndicator>
                  <div className="w-full flex items-center justify-between gap-2">
                    <span
                      className={twMerge(
                        "font-semibold w-fit flex items-center",
                        e.disabled ? "text-textFadedLight dark:text-textFadedDark" : ""
                      )}
                    >
                      {e.displayText}
                    </span>
                    {e.bubbleValue !== undefined && (
                      <span className="font-semibold ">{e.bubbleValue}</span>
                    )}
                  </div>
                </DropdownMenu.RadioItem>
              ))}

				</div>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </div>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
