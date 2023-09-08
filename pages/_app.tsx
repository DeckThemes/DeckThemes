import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LandingFooter, DesktopFooter } from "../components";
import Nav from "@components/Nav/Nav";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { AccountData } from "../types";
import { getMeDataOnInit } from "../apiHelpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logInWithToken } from "apiHelpers/auth/logInWithToken";
import { IoMdClose } from "react-icons/io";
import { authContext, desktopModeContext } from "contexts";
import { InstalledTheme } from "@customTypes/DesktopModeTypes";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

export default function App({ Component, pageProps }: AppProps) {
  const [desktopMode, setDesktopMode] = useState<boolean | undefined>(undefined);
  const [installing, setInstalling] = useState<boolean>(false);
  const [installedThemes, setInstalledThemes] = useState<InstalledTheme[]>([]);
  const [accountInfo, setAccountInfo] = useState<AccountData | undefined>(undefined);
  const router = useRouter();

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
    async function handleMessage(event: MessageEvent<{ action: string; payload: any }>) {
      if (event.data.action === "themeInstalled") {
        setInstalling(false);
      }
      if (event.data.action === "logInWithToken") {
        const meJson = await logInWithToken(event.data.payload);
        if (meJson?.username) {
          setAccountInfo(meJson);
        }
      }
      if (event.data.action === "provideInstallState") {
        console.log("received test");
        setInstalledThemes(event.data.payload);
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
    <ThemeProvider attribute="class" disableTransitionOnChange={true}>
      <authContext.Provider value={{ accountInfo, setAccountInfo }}>
        <desktopModeContext.Provider
          value={{
            desktopMode,
            setDesktopMode,
            installing,
            setInstalling,
            installedThemes,
            setInstalledThemes,
          }}
        >
          <div className="relative flex min-h-screen flex-col bg-base-6-light text-textLight dark:bg-base-6-dark dark:text-textDark">
            {desktopMode !== undefined ? (
              <>
                <Nav />
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
                <main
                  className={twMerge(
                    "page-shadow mx-4 flex flex-col items-center rounded-3xl border-[1px]  border-borders-base1-light bg-base-2-light dark:border-borders-base1-dark dark:bg-base-2-dark",
                    router.pathname !== "/" && "py-12"
                    // desktopMode && "pt-0",
                    // !desktopMode &&
                    //   "page-shadow mx-4 rounded-3xl border-[1px] border-borders-base1-light bg-base-2-light dark:border-borders-base1-dark  dark:bg-base-2-dark"
                  )}
                >
                  <Component {...pageProps} />
                </main>
                {desktopMode ? <DesktopFooter /> : <LandingFooter />}
              </>
            ) : (
              <></>
            )}
          </div>
        </desktopModeContext.Provider>
      </authContext.Provider>
    </ThemeProvider>
  );
}
