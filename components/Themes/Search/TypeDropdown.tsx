import { RadioDropdown } from "../../Primitives";

export function TypeDropdown({
  typeValue = "",
  onTypeChange,
  typeOptions,
}: {
  typeValue?: string;
  onTypeChange?: (e: any) => void;
  typeOptions: {
    displayText: string;
    value: string;
  }[];
}) {
  return (
    <div className="font-fancy flex flex-col gap-2 rounded-md text-sm">
      <RadioDropdown
        headingText="Platform"
        options={typeOptions}
        value={typeValue}
        onValueChange={(e: any) => {
          onTypeChange && onTypeChange(e);
        }}
      />
    </div>
  );
}
