import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTheme } from 'next-themes'
import { ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { GiHamburgerMenu } from "react-icons/gi";

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
	const { theme } = useTheme()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="h-fit w-12 font-bold border border-borders-base3-dark rounded-full text-xs px-4 py-2 justify-center text-white flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 select-none hover:bg-base-3-dark">
        <GiHamburgerMenu size={16} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <div className={`${theme}`}>
          <DropdownMenu.Content className="z-[9999] text-sm radio-dropdown font-fancy select-none cursor-default overflow-hidden bg-base-3-light dark:bg-base-3-dark w-[250px] text-black dark:text-white rounded-xl border-2 border-borders-base2-light dark:border-borders-base2-dark transition-all">
            {options.map((e) => {
              return (
                <DropdownMenu.Item
                  disabled={e.disabled}
                  key={e.displayText}
                  onSelect={e.onSelect}
                  className="flex items-center justify-center px-4 py-2 relative hover:bg-brandBlue dark:hover:bg-brandBlue focus:bg-brandBlue dark:focus:bg-brandBlue outline-none m-1 rounded-lg"
                >
                  <div className="w-full flex items-center justify-between gap-2">
                    <span
                      className={twMerge(
                        "font-semibold w-fit flex items-center",
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
