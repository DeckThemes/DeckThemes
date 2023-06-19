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
      <div className="h-10 flex relative gap-8 p-2 px-4 bg-base-3-light dark:bg-base-3-dark rounded-full font-fancy">
        <button className="w-16 z-20" onClick={() => setOrderValue(orderOptions[0])}>
          <span>{orderOptions[0]}</span>
        </button>
        <button className="w-16 z-20" onClick={() => setOrderValue(orderOptions[1])}>
          <span>{orderOptions[1]}</span>
        </button>
        <div
          className={`z-10 bg-brandBlue w-24 h-10 rounded-3xl absolute top-0 transition-all duration-100`}
          style={{ left: orderValue === orderOptions[0] ? 0 : "50%" }}
        />
      </div>
    </>
  );
}
