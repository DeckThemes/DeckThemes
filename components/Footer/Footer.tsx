import { useContext } from "react";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { themeContext } from "../../styles";

export function Footer() {
  const { theme, setTheme } = useContext(themeContext);
  return (
    <footer className="w-full bg-cardLight dark:bg-cardDark h-fit p-4 flex justify-center items-center font-semibold">
      <p className="max-w-5xl text-[0.5rem] md:text-xs">
        Decky Loader, CSS Loader, and Audio Loader are not affiliated with Valve Corporation. Steam,
        the Steam logo, Steam Deck, and the Steam Deck logo are trademarks and/or registered
        trademarks of Valve Corporation in the U.S. and/or other countries.
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
    </footer>
  );
}
