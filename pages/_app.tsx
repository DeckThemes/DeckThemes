import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Footer, LoadingPage, MainNav } from "../components";
import { createContext, useEffect, useState } from "react";
import { Theme, themeContext } from "../styles";
import { AccountData, AuthContextContents } from "../types";
import { getMeDataOnInit } from "../apiHelpers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const authContext = createContext<AuthContextContents>({
  accountInfo: undefined,
  setAccountInfo: () => {},
});

export const desktopModeContext = createContext<any>({
  desktopMode: false,
  setDesktopMode: () => {},
  installing: false,
  setInstalling: () => {},
});

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  const [desktopMode, setDesktopMode] = useState<boolean | undefined>(undefined);
  const [installing, setInstalling] = useState<boolean>(false);

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
    // iFrame event handling
    function handleMessage(event: any) {
      if (event.data === "themeInstalled") {
        setInstalling(false);
      }
    }
    window.addEventListener("message", handleMessage);

    // The enabling of desktop mode used to be through another iframe postMessage, however that led to ~100ms of seeing the wrong ui before it switched
    // This properly renders the right version of the site on first page load
    if (window && new URLSearchParams(window.location.search).get("desktop")) {
      setDesktopMode(true);
    } else {
      setDesktopMode(false);
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const [accountInfo, setAccountInfo] = useState<AccountData | undefined>(undefined);

  return (
    <themeContext.Provider value={{ theme, setTheme }}>
      <authContext.Provider value={{ accountInfo, setAccountInfo }}>
        <desktopModeContext.Provider
          value={{ desktopMode, setDesktopMode, installing, setInstalling }}
        >
          <div className={`${theme}`}>
            <div className="bg-bgLight dark:bg-bgDark text-textLight dark:text-textDark min-h-screen flex flex-col relative">
              {desktopMode !== undefined ? (
                <>
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
                  <div className="mt-auto">
                    <Footer />
                  </div>
                </>
              ) : (
                <LoadingPage />
              )}
            </div>
          </div>
        </desktopModeContext.Provider>
      </authContext.Provider>
    </themeContext.Provider>
  );
}
