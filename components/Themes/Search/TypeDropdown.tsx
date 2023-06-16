import { ReactSelectCustomClasses, ReactSelectCustomLabel } from "../../CustomDropdowns";
import Select from "react-select";

export function TypeDropdown({
  typeValue,
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
    label: <ReactSelectCustomLabel mainText={e.displayText} />,
  }));

  return (
    <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-md p-2">
      <span>Type</span>
      <Select
        value={formattedTypeOpts.find((e) => e.value === typeValue) || formattedTypeOpts[0]}
        onChange={(e) => {
          onTypeChange && onTypeChange({ target: e });
        }}
        maxMenuHeight={400}
        {...ReactSelectCustomClasses}
        isSearchable={false}
        options={formattedTypeOpts}
      />
    </div>
  );
}
