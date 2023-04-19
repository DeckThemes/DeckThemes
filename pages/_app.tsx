import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Footer, MainNav } from "../components";
import { createContext, useEffect, useState } from "react";
import { Theme, themeContext } from "../styles";
import { AccountData, AuthContextContents } from "../types";
import { getMeDataOnInit } from "../api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const authContext = createContext<AuthContextContents>({
  accountInfo: undefined,
  setAccountInfo: () => {},
});

export const desktopModeContext = createContext<any>({
  desktopMode: false,
  setDesktopMode: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  const [desktopMode, setDesktopMode] = useState<boolean>(false);

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

  useEffect(() => {
    window.addEventListener("message", (event) => {
      console.log("IFRAME DETECTED MESSAGE", event);
      // Do we trust the sender of this message?
      if (event.origin !== "http://localhost:3000") return;

      if (event.data === "enableDesktopAppMode") {
        setTheme("light");
        setDesktopMode(true);
      }
    });

    window.parent.postMessage("isThisDesktopApp", "http://localhost:3000");
  }, []);

  const [accountInfo, setAccountInfo] = useState<AccountData | undefined>(undefined);

  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      <authContext.Provider value={{ accountInfo, setAccountInfo }}>
        <desktopModeContext.Provider value={{ desktopMode, setDesktopMode }}>
          <div className={`${theme}`}>
            <div className="bg-bgLight dark:bg-bgDark text-textLight dark:text-textDark min-h-screen flex flex-col">
              <MainNav />
              <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
              />
              <Component {...pageProps} />
              <div className="mt-auto pt-20">
                <Footer />
              </div>
            </div>
          </div>
        </desktopModeContext.Provider>
      </authContext.Provider>
    </themeContext.Provider>
  );
}
