import { authContext } from "contexts";
import { ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";

export function SquishyButton({
  children,
  onClick,
  buttonProps,
  customClass,
  requiresLogin = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  buttonProps?: any;
  customClass?: string;
  requiresLogin?: boolean;
}) {
  const { accountInfo } = useContext(authContext);
  return (
    <button
      {...buttonProps}
      onClick={onClick}
      className={twMerge(
        "font-fancy flex w-fit select-none items-center gap-2 rounded-full border border-borders-base3-dark py-2 px-4 text-xs font-bold text-textLight transition duration-150 dark:text-textDark dark:hover:text-bgLight",
        !requiresLogin || !!accountInfo
          ? "cursor-pointer select-none hover:scale-95 hover:bg-base-4-light hover:active:scale-90 dark:hover:bg-base-3-dark"
          : "cursor-auto",
        customClass
      )}
    >
      {children}
    </button>
  );
}
