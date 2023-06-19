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
  const formattedTypeOpts = typeOptions.map((e) => ({
    value: e.value,
    // TODO: fix this
    displayName: e.displayText,
  }));

  return (
    <div className="flex flex-col rounded-md gap-2">
      <span>Type</span>
      <RadioDropdown
        options={formattedTypeOpts}
        value={typeValue}
        onValueChange={(e: any) => {
          onTypeChange && onTypeChange(e);
        }}
      />
    </div>
  );
}
