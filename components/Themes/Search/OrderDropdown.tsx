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
      <div className="flex flex-col rounded-md gap-2">
        <span>Order</span>
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
