import { useEffect, useState } from "react";
import { LoadingSpinner } from "..";
import { twMerge } from "tailwind-merge";

export function PatreonFooterBar() {
  const [isHovered, setIsHovered] = useState(false);
  const [patreonPercentage2, setPatreonPercentage] = useState<number | undefined>(undefined);
  const patreonPercentage = 70;

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DEV_MODE === "true") {
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_SHARE_URL}/api/patreonfetch`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (!isNaN(Number(json))) {
          setPatreonPercentage(Number(json));
        }
      });
  }, []);
  return (
    <div>
      {patreonPercentage !== undefined ? (
        <div className="flex w-full flex-col gap-2 px-8 pt-10">
          <div className="relative z-10 h-2 w-full rounded-xl bg-base-4-light dark:bg-base-3-dark">
            <div
              className={twMerge(
                "absolute left-0 top-0 z-0 h-2 rounded-xl",
                patreonPercentage >= 100 ? "bg-brandBlue" : "bg-patreonColor"
              )}
              style={{
                width: `${patreonPercentage}%`,
              }}
            />
          </div>
          <div className="flex w-full items-center justify-between text-sm">
            <span>Server Costs: {patreonPercentage}% Covered</span>
            <a href={process.env.NEXT_PUBLIC_PATREON_URL}>Support DeckThemes</a>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center gap-4">
          <LoadingSpinner size={20} />
          <span>Loading Contribution Data...</span>
        </div>
      )}
    </div>
  );
}
