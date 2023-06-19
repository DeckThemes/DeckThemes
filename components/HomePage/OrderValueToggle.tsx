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
      <div className="h-10 flex relative gap-8 p-2 px-4 bg-base-3-light dark:bg-base-5-dark rounded-full font-fancy border-2 border-borders-base2-light dark:border-borders-base2-dark ">
        <button className="relative w-16 z-20" onClick={() => setOrderValue(orderOptions[0])}>
          <span className="absolute -top-0.5 left-0">{orderOptions[0]}</span>
        </button>
        <button className="relative w-16 z-20" onClick={() => setOrderValue(orderOptions[1])}>
          <span className="absolute -top-0.5 right-1">{orderOptions[1]}</span>
        </button>
        <div
          className={`z-10 bg-brandBlue m-1 w-[calc(100%-50%-8px)] h-[calc(100%-8px)] rounded-3xl absolute top-0 transition-all duration-100`}
          style={{ left: orderValue === orderOptions[0] ? 0 : "50%" }}
        />
      </div>
    </>
  );
}
