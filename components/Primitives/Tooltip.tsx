import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactElement, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";
export function Tooltip({
  triggerContent,
  delayDuration = 100,
  tooltipSide = "bottom",
  contentClass = "",
  arrow = false,
  content,
}: {
  triggerContent: ReactElement;
  delayDuration?: number;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  contentClass?: string;
  arrow?: boolean;
  content: ReactElement;
}) {
  const { theme } = useTheme();

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={delayDuration}>
        <RadixTooltip.Trigger>{triggerContent}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <div className={`${theme}`}>
            <RadixTooltip.Content
              side={tooltipSide}
              className={twMerge(
                "font-fancy rounded-xl bg-fore-3-light p-2 px-4 text-black dark:bg-fore-3-dark dark:text-white",
                contentClass
              )}
            >
              {arrow && <RadixTooltip.Arrow />}
              {content}
            </RadixTooltip.Content>
          </div>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
