import { Dispatch, SetStateAction } from "react";

export function ActionButton({
  selectedAction,
  action,
  setAction,
  icon,
}: {
  selectedAction: "approve" | "deny" | undefined;
  action: "approve" | "deny";
  setAction: Dispatch<SetStateAction<"approve" | "deny" | undefined>>;
  icon: JSX.Element;
}) {
  const colorSets = {
    approve: "bg-emerald-500 dark:bg-emerald-800",
    deny: "bg-red-500 dark:bg-red-800",
  };

  return (
    <>
      <button
        className={`${
          action === selectedAction && colorSets[action]
        } flex items-center rounded-full border-2 border-borders-base1-light p-2 transition-colors hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark`}
        onClick={() => {
          action !== selectedAction ? setAction(action) : setAction(undefined);
        }}
      >
        {icon}
        <span className="ml-2 mr-1 text-xl font-medium capitalize">{action}</span>
      </button>
    </>
  );
}
