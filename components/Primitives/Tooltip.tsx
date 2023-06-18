import * as RadixTooltip from "@radix-ui/react-tooltip";
import { ReactElement } from "react";
import { twMerge } from "tailwind-merge";

export function Tooltip({
  triggerContent,
  delayDuration = 100,
  tooltipSide = "bottom",
  contentClass = "",
  content,
}: {
  triggerContent: ReactElement;
  delayDuration?: number;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  contentClass?: string;
  content: ReactElement;
}) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={delayDuration}>
        <RadixTooltip.Trigger>{triggerContent}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={tooltipSide}
            className={twMerge("p-2 bg-borderLight dark:bg-borderDark", contentClass)}
          >
            <RadixTooltip.Arrow />
            {content}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
