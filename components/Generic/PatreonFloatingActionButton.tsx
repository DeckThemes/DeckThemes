import { useState, useEffect } from "react";
import { Patreon } from "@icons-pack/react-simple-icons";

export function PatreonFloatingActionButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [patreonPercentage, setPatreonPercentage] = useState<
    number | undefined
  >(undefined);

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
    <>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed bottom-6 right-6 z-[9998] flex h-16 w-fit max-w-[calc(100vw-24px)] origin-right select-none items-center justify-center rounded-[5rem] bg-[#f56042] px-8 font-bold shadow-2xl transition-all delay-[125ms] duration-[250ms] overflow-hidden ${
          isHovered ? "py-12" : "scale-75"
        }`}
      >
        <Patreon className="min-h-6 min-w-6 flex flex-shrink-0" />
        <div
          className={`transition-all delay-150 duration-150 ${
            isHovered ? "max-w-0 opacity-0" : "md:ml-4 max-w-[4rem]"
          }`}
        >
          <span className="hidden md:block">Donate</span>
        </div>
        <div
          className={`overflow-hidden transition-all delay-150 duration-150 md:whitespace-nowrap ${
            isHovered
              ? "opacity-1 ml-4 max-h-[48rem] max-w-[33rem]"
              : "max-h-0 max-w-0 opacity-0"
          }`}
        >
          Generous patrons covered {patreonPercentage !== undefined}% of costs
          this month.
        </div>
      </div>
    </>
  );
}
