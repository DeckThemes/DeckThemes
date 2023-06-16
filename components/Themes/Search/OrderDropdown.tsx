import { ReactSelectCustomClasses, ReactSelectCustomLabel } from "../../CustomDropdowns";
import Select from "react-select";

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
          label: <ReactSelectCustomLabel mainText={orderName} />,
        }))
      : [
          {
            value: "Alphabetical (A to Z)",
            label: <ReactSelectCustomLabel mainText="Alphabetical (A to Z)" />,
          },
        ];
  return (
    <>
      <div className="flex flex-col items-center bg-cardLight dark:bg-cardDark rounded-md p-2">
        <span>Order</span>
        <Select
          value={formattedOrderOpts.find((e) => e.value === orderValue) || formattedOrderOpts[0]}
          onChange={(e) => {
            onOrderChange && onOrderChange({ target: e });
          }}
          maxMenuHeight={400}
          {...ReactSelectCustomClasses}
          isSearchable={false}
          options={formattedOrderOpts}
        />
      </div>
    </>
  );
}
