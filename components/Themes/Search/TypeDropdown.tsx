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
    <div className="font-fancy text-sm flex flex-col rounded-md gap-2">
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
