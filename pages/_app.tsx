import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LandingFooter, LoadingPage, MainNav } from "../components";
import { createContext, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { AccountData, AuthContextContents } from "../types";
import { getMeDataOnInit } from "../apiHelpers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logInWithToken } from "apiHelpers/auth/logInWithToken";
import { IoMdClose } from "react-icons/io";

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
  const [desktopMode, setDesktopMode] = useState<boolean | undefined>(undefined);
  const [installing, setInstalling] = useState<boolean>(false);

  const [accountInfo, setAccountInfo] = useState<AccountData | undefined>(undefined);

  async function initGetUserData(): Promise<void> {
    const meJson = await getMeDataOnInit();
    if (meJson?.username) {
      setAccountInfo(meJson);
    }
  }

  useEffect(() => {
    initGetUserData();
  }, []);

  useEffect(() => {
    // iFrame event handling
    async function handleMessage(event: any) {
      if (event.data.action === "themeInstalled") {
        setInstalling(false);
      }
      if (event.data.action === "logInWithToken") {
        console.log("TOKEN", event.data.payload);
        const meJson = await logInWithToken(event.data.payload);
        if (meJson?.username) {
          setAccountInfo(meJson);
        }
      }
    }
    window.addEventListener("message", handleMessage);

    // The enabling of desktop mode used to be through another iframe postMessage, however that led to ~100ms of seeing the wrong ui before it switched
    // This properly renders the right version of the site on first page load
    if (window && window.location.pathname === "/desktop") {
      setDesktopMode(true);
    } else {
      setDesktopMode(false);
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <ThemeProvider attribute="class">
      <authContext.Provider value={{ accountInfo, setAccountInfo }}>
        <desktopModeContext.Provider
          value={{ desktopMode, setDesktopMode, installing, setInstalling }}
        >
          <div className="relative flex min-h-screen flex-col bg-base-6-light text-textLight dark:bg-base-6-dark dark:text-textDark">
            {desktopMode !== undefined ? (
              <>
                <MainNav />
                <ToastContainer
                  position="bottom-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop
                  closeButton={<IoMdClose />}
                  toastClassName="rounded-xl border-2 border-borders-base1-light bg-base-3-light transition hover:border-borders-base2-light dark:border-borders-base1-dark dark:bg-base-3-dark hover:dark:border-borders-base2-dark"
                  bodyClassName="rounded-xl font-fancy text-black dark:text-white"
                  closeOnClick
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                <Component {...pageProps} />
                <LandingFooter />
              </>
            ) : (
              <LoadingPage />
            )}
          </div>
        </desktopModeContext.Provider>
      </authContext.Provider>
    </ThemeProvider>
  );
}
