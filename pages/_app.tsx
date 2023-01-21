import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Footer, MainNav } from "../components";
import { createContext, useEffect, useState } from "react";
import { Theme, themeContext } from "../styles";
import { AccountData, AuthContextContents } from "../types";
import { getMeDataOnInit } from "../api";

export const authContext = createContext<AuthContextContents>({
  accountInfo: undefined,
  setAccountInfo: () => {},
});

export const toastContext = createContext<any>({
  toastText: undefined,
  setToastText: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  function initSetTheme(): void {
    //Sets dark theme based on browser preferences, but also allows for manual changing
    if (localStorage?.theme) {
      localStorage.theme === "light" || localStorage.theme === "dark"
        ? setTheme(localStorage.theme)
        : console.warn(
            "Theme value in localStorage is not valid! Please set it to either 'light' or 'dark'"
          );
      return;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      localStorage.theme = "dark";
      return;
    }
    setTheme("dark");
    return;
  }

  async function initGetUserData(): Promise<void> {
    const meJson = await getMeDataOnInit();
    if (meJson?.username) {
      setAccountInfo(meJson);
    }
  }

  useEffect(() => {
    initSetTheme();
    initGetUserData();
  }, []);

  const [accountInfo, setAccountInfo] = useState<AccountData | undefined>(undefined);
  const [toastText, setToastText] = useState<string | undefined>(undefined);

  const [toastOpacity, setToastOpacity] = useState<boolean>(false);

  useEffect(() => {
    if (toastText) {
      setTimeout(() => {
        setToastOpacity(true);
        setTimeout(() => {
          setToastOpacity(false);
          setTimeout(() => {
            setToastText(undefined);
          }, 101);
        }, 3000);
      }, 101);
    }
  }, [toastText]);

  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      <authContext.Provider value={{ accountInfo, setAccountInfo }}>
        <toastContext.Provider value={{ toastText, setToastText }}>
          <div className={`${theme}`}>
            <div className="bg-bgLight dark:bg-bgDark text-textLight dark:text-textDark min-h-screen flex flex-col">
              <MainNav />
              <Component {...pageProps} />
              <div
                className={`transition-opacity duration-100 absolute bottom-5 left-1/2 -translate-x-1/2 bg-borderLight dark:bg-borderDark p-4 rounded-3xl text-2xl ${
                  toastOpacity ? "opacity-100" : "opacity-0"
                }`}
              >
                {toastText}
              </div>
              <div className="mt-auto pt-20">
                <Footer />
              </div>
            </div>
          </div>
        </toastContext.Provider>
      </authContext.Provider>
    </themeContext.Provider>
  );
}
