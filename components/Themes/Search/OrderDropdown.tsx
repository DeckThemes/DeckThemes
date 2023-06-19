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
  const formattedOrderOpts =
    orderOpts.length > 0
      ? orderOpts.map((orderName) => ({
          value: orderName,
        }))
      : [
          {
            value: "Alphabetical (A to Z)",
          },
        ];
  return (
    <>
      <div className="font-fancy text-sm flex flex-col rounded-md gap-2">
        <div className="font-bold">Sort by</div>
        <RadioDropdown
          options={formattedOrderOpts}
          value={orderValue}
          onValueChange={(e: any) => {
            onOrderChange && onOrderChange(e);
          }}
        />
      </div>
    </>
  );
}
