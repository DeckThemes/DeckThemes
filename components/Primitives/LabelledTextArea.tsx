import * as Label from "@radix-ui/react-label";
import { twMerge } from "tailwind-merge";

export function LabelledTextArea({
  label,
  value,
  onValueChange,
  rootClass = "",
  labelClass = "",
  debounce = false,
}: {
  label: string;
  value: string;
  onValueChange: (e: string) => void;
  rootClass?: string;
  labelClass?: string;
  debounce?: boolean;
}) {
  return (
    <div className={twMerge("flex flex-col items-start justify-between gap-2 w-full", rootClass)}>
      <Label.Root className={twMerge("font-bold font-fancy text-sm", labelClass)}>
        {label}
      </Label.Root>
      <textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-64 p-2 w-full bg-base-3-light dark:bg-base-3-dark rounded-xl border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark focus:border-borders-base3-light focus:dark:border-borders-base3-dark outline-none transition-all"
      />
    </div>
  );
}
