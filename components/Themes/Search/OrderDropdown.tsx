import { RadioDropdown } from "../../Primitives";

export function OrderDropdown({
  orderOpts = ["ERROR"],
  orderValue,
  onOrderChange,
}: {
  orderOpts?: string[];
  orderValue: string;
  onOrderChange?: (e: any) => void;
}) {
  return (
    <>
      <div className="font-fancy flex flex-col gap-2 rounded-md text-sm">
        <RadioDropdown
          headingText="Sort by"
          options={orderOpts}
          value={orderValue}
          onValueChange={(e: any) => {
            onOrderChange && onOrderChange(e);
          }}
        />
      </div>
    </>
  );
}
