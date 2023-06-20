import * as RadioGroup from "@radix-ui/react-radio-group";
import { twMerge } from "tailwind-merge";

export function HorizontalRadio({
  options,
  value,
  onValueChange,
  rootClass = "",
  itemClass = "",
}: {
  options: {
    displayText: string;
    value: string;
    disabled?: boolean;
  }[];
  onValueChange: (value: string) => void;
  value: string;
  rootClass?: string;
  itemClass?: string;
}) {
  return (
    <RadioGroup.Root
      onValueChange={onValueChange}
      className={twMerge("flex", rootClass)}
    >
      {options.map((e, i) => {
        const selected = value === e.value;
        return (
          <RadioGroup.Item
            disabled={e.disabled}
            value={e.value}
            key={`Carousel_Dot_${i}`}
            className={twMerge(
              `m-1 h-10 w-32 ${
                selected
                  ? `bg-brandBlue text-white`
                  : `bg-base-3-light hover:bg-base-4-light  dark:bg-base-3-dark hover:dark:bg-base-4-dark`
              } font-fancy rounded-full font-bold transition-colors duration-200`,
              itemClass
            )}
          >
            <RadioGroup.Indicator />
            <span>{e.displayText}</span>
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}
