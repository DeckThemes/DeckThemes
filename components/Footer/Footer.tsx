import { useContext, useEffect, useState } from "react";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { themeContext } from "../../styles";
import Link from "next/link";
import { LoadingSpinner } from "../Generic";

export function Footer() {
  const { theme, setTheme } = useContext(themeContext);
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
    <footer className="mt-auto flex h-fit w-full flex-col">
      <div className="flex w-full items-center px-12 py-6">
        <div className="flex max-w-xl flex-col text-[0.5rem] md:text-xs">
          <p>
            Decky Loader, CSS Loader, and Audio Loader are not affiliated with
            Valve Corporation. Steam, the Steam logo, Steam Deck, and the Steam
            Deck logo are trademarks and/or registered trademarks of Valve
            Corporation in the U.S. and/or other countries.
          </p>
          <Link href="/tos" className="text-lg underline">
            Deckthemes Terms Of Use
          </Link>
        </div>
        <button
          className="ml-auto pl-4 pr-1 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
          onClick={() => {
            if (theme === "light") {
              setTheme("dark");
              localStorage.theme = "dark";
              return;
            }
            setTheme("light");
            localStorage.theme = "light";
            return;
          }}
        >
          {theme === "light" ? (
            <FaRegSun className="h-8 w-8" />
          ) : (
            <FaRegMoon className="h-8 w-8" />
          )}
        </button>
      </div>
      {/* {!!patreonPercentage && (
        <div className="h-8 bg-cardLight dark:bg-cardDark flex items-center px-4">
          <div className="h-8 w-1/2 font-fancy flex items-center justify-between px-4">
            <span>Server Costs: {patreonPercentage}% Covered</span>{" "}
            <Link href={process.env.NEXT_PUBLIC_PATREON_URL} className="underline text-patreonColor">
              Support Us!
            </Link>
          </div>
          <div className="h-4 w-1/2 relative rounded-full bg-cardLight dark:bg-borderDark">
            <div
              className="bg-patreonColor transition-all absolute left-0 h-4 z-0 rounded-l-full"
              style={{
                width: Math.min(patreonPercentage, 100) + "%",
                backgroundColor: patreonPercentage < 100 ? "#FF424D" : "#33aaff",
              }}
            />
          </div>
        </div>
      )} */}
      {/* {!!patreonPercentage && ( */}
      <div className="relative flex h-8 items-center overflow-hidden bg-cardLight dark:bg-cardDark">
        {patreonPercentage !== undefined ? (
          <>
            <div className="font-fancy z-10 flex w-full items-center justify-between px-4">
              <span>Server Costs: {patreonPercentage}% Covered</span>{" "}
              <Link
                rel="noreferrer"
                target="_blank"
                href={process.env.NEXT_PUBLIC_PATREON_URL || ""}
              >
                {/* TODO: Probably can refactor this */}
                {patreonPercentage < 100 ? (
                  <span className="font-medium text-[#A24] underline dark:text-patreonColor">
                    Support Us!
                  </span>
                ) : (
                  <span>Support Us!</span>
                )}
              </Link>
            </div>
            <div
              className="absolute left-0 z-0 h-8 scale-110 bg-cardLight blur-lg transition-all dark:bg-borderDark"
              style={{
                width: Math.min(patreonPercentage, 100) + "%",
                backgroundColor:
                  patreonPercentage < 100 ? "#FF424D" : "#33aaff",
              }}
            />
          </>
        ) : (
          <div className="flex w-full items-center justify-center gap-4">
            <LoadingSpinner size={20} />
            <span>Loading Contribution Data...</span>
          </div>
        )}
      </div>
    </footer>
  );
}
