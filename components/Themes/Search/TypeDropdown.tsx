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
    <div className="font-fancy text-sm flex flex-col rounded-md gap-2">
      <div className="font-bold">Type</div>
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
