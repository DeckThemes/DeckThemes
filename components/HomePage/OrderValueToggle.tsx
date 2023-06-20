import { Dispatch, SetStateAction, useState } from "react";

export function OrderValueToggle({
  orderValue,
  setOrderValue,
  orderOptions,
}: {
  orderValue: string;
  setOrderValue: Dispatch<SetStateAction<string>>;
  orderOptions: string[];
}) {
  return (
    <>
      <div className="font-fancy relative flex h-10 gap-8 rounded-full border-2 border-borders-base1-light bg-base-3-light p-2 px-4 dark:border-borders-base2-dark dark:bg-base-5-dark ">
        <button
          className="relative z-20 w-16"
          onClick={() => setOrderValue(orderOptions[0])}
        >
          <span className="absolute -top-0.5 left-0">{orderOptions[0]}</span>
        </button>
        <button
          className="relative z-20 w-16"
          onClick={() => setOrderValue(orderOptions[1])}
        >
          <span className="absolute -top-0.5 right-1">{orderOptions[1]}</span>
        </button>
        <div
          className={`absolute top-0 z-10 m-1 h-[calc(100%-8px)] w-[calc(100%-50%-8px)] rounded-3xl bg-brandBlue transition-all duration-100`}
          style={{ left: orderValue === orderOptions[0] ? 0 : "50.5%" }}
        />
      </div>
    </>
  );
}
