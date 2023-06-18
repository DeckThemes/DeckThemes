import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactElement, useContext } from "react";
import { twMerge } from "tailwind-merge";
import { themeContext } from "../../styles";

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
  const { theme } = useContext(themeContext);
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={delayDuration}>
        <RadixTooltip.Trigger>{triggerContent}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <div className={`${theme}`}>
            <RadixTooltip.Content
              side={tooltipSide}
              className={twMerge(
                "rounded-xl text-black dark:text-white p-2 px-4 font-fancy bg-fore-3-light dark:bg-fore-3-dark",
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
