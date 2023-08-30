import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import { ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { GiHamburgerMenu } from "react-icons/gi";
import { SquishyButton } from "./SquishyButton";

export function MenuDropdown({
  options,
}: {
  options: {
    disabled?: boolean;
    displayText: string;
    icon: ReactNode;
    onSelect: () => void;
  }[];
}) {
  const { theme } = useTheme();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <SquishyButton>
          <GiHamburgerMenu size={16} />
        </SquishyButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <div className={`${theme}`}>
          <DropdownMenu.Content className="radio-dropdown font-fancy z-[9999] w-[250px] cursor-default select-none overflow-hidden rounded-xl border-2 border-borders-base2-light bg-base-3-light text-sm text-black transition-all dark:border-borders-base2-dark dark:bg-base-3-dark dark:text-white">
            {options.map((e) => {
              return (
                <DropdownMenu.Item
                  disabled={e.disabled}
                  key={e.displayText}
                  onSelect={e.onSelect}
                  className="relative m-1 flex items-center justify-center rounded-lg px-4 py-2 outline-none hover:bg-brandBlue focus:bg-brandBlue dark:hover:bg-brandBlue dark:focus:bg-brandBlue"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span
                      className={twMerge(
                        "flex w-fit items-center font-semibold",
                        e.disabled ? "text-textFadedLight dark:text-textFadedDark" : ""
                      )}
                    >
                      {e.displayText}
                    </span>
                    {e.icon}
                  </div>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </div>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
