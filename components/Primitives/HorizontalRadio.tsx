import * as RadioGroup from "@radix-ui/react-radio-group";

export function HorizontalRadio({
  options,
  value,
  onValueChange,
  rootClass = "",
}: {
  options: {
    displayText: string;
    value: string;
    disabled?: boolean;
  }[];
  onValueChange: any;
  value: string;
  rootClass?: string;
}) {
  return (
    <RadioGroup.Root onValueChange={onValueChange} className={rootClass}>
      {options.map((e, i) => {
        const selected = value === e.value;
        return (
          <RadioGroup.Item
            disabled={e.disabled}
            value={e.value}
            key={`Carousel_Dot_${i}`}
            className={`w-32 h-10 m-1 ${
              selected
                ? `bg-brandBlue`
                : `bg-base-3-light dark:bg-base-3-dark  hover:bg-base-4-light hover:dark:bg-base-4-dark`
            } rounded-full transition-colors duration-500 font-fancy`}
          >
            <RadioGroup.Indicator />
            <span>{e.displayText}</span>
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
}
