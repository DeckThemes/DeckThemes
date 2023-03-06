import { useContext, useEffect, useState } from "react";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { themeContext } from "../../styles";
import Link from "next/link";

export function Footer() {
  const { theme, setTheme } = useContext(themeContext);
  const [patreonPercentage, setPatreonPercentage] = useState<number>(0);

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
    <footer className="w-full bg-cardLight dark:bg-cardDark h-fit flex flex-col">
      <div className="flex items-center w-full p-4">
        <p className="max-w-5xl text-[0.5rem] md:text-xs">
          Decky Loader, CSS Loader, and Audio Loader are not affiliated with Valve Corporation.
          Steam, the Steam logo, Steam Deck, and the Steam Deck logo are trademarks and/or
          registered trademarks of Valve Corporation in the U.S. and/or other countries.
        </p>
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
          {theme === "light" ? <FaRegSun className="w-8 h-8" /> : <FaRegMoon className="w-8 h-8" />}
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
      <div className="h-8 bg-cardLight dark:bg-cardDark flex items-center overflow-hidden relative">
        <div className="font-fancy flex items-center justify-between px-4 z-10 w-full">
          <span>Server Costs: {patreonPercentage}% Covered</span>{" "}
          <Link
            rel="noreferrer"
            target="_blank"
            href={process.env.NEXT_PUBLIC_PATREON_URL || ""}
            className="underline font-medium text-[#A24] dark:text-patreonColor"
          >
            Support Us!
          </Link>
        </div>
        <div
          className="scale-110 transition-all absolute left-0 h-8 z-0 bg-cardLight dark:bg-borderDark blur-lg"
          style={{
            width: Math.min(patreonPercentage, 100) + "%",
            backgroundColor: patreonPercentage < 100 ? "#FF424D" : "#33aaff",
          }}
        />
      </div>
      {/* )} */}
    </footer>
  );
}
