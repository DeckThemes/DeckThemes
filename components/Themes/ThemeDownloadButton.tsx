import { FiArrowDown, FiCheck } from "react-icons/fi";
import { LoadingSpinner } from "../Generic";
import { FullCSSThemeInfo } from "../../types";
import { desktopModeContext } from "contexts";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";

export function ThemeDownloadButton({ themeData }: { themeData: FullCSSThemeInfo }) {
  const { desktopMode, installing, setInstalling, installedThemes } =
    useContext(desktopModeContext);

  const desktopEntry = installedThemes?.find((e) => e.name === themeData.name);
  return (
    <>
      {themeData.download !== undefined ? (
        <>
          <button
            className={twMerge(
              "group mb-2 inline-flex w-fit items-center justify-center gap-2 rounded-full border-2 border-borders-base1-light py-2 px-4 text-sm font-semibold text-white no-underline transition hover:border-borders-base2-light hover:bg-fore-11-dark focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:opacity-60 dark:border-borders-base1-dark hover:dark:border-borders-base2-dark sm:mb-0",
              desktopEntry && desktopEntry.version === themeData.version
                ? "hover: bg-base-3-light text-black dark:bg-base-3-dark dark:text-white"
                : "bg-brandBlue hover:text-fore-contrast-dark dark:bg-brandBlue"
            )}
            onClick={() => {
              if (desktopMode) {
                setInstalling(true);
                window.parent.postMessage(
                  {
                    action: "installTheme",
                    payload: themeData.id,
                  },
                  "*"
                );
                return;
              }
              themeData !== undefined &&
                location.assign(
                  `${process.env.NEXT_PUBLIC_API_URL}/blobs/${themeData.download.id}`
                );
            }}
          >
            <div className="flex h-6 w-6  items-center justify-center rounded-full">
              {installing && <LoadingSpinner />}
              {(!installing || !desktopMode) && (
                <>
                  {desktopEntry && desktopEntry.version === themeData.version ? (
                    <FiCheck size={12} />
                  ) : (
                    <FiArrowDown size={12} />
                  )}
                </>
              )}
            </div>
            <div>
              {desktopMode ? (
                <>
                  <div className="ml-2 mr-3 flex flex-col items-center justify-center">
                    <span className="font-fancy font-semibold">
                      {desktopEntry
                        ? desktopEntry.version === themeData.version
                          ? "Installed"
                          : "Update"
                        : "Install"}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="ml-2 mr-3 flex flex-col items-center justify-center">
                    <span className="font-fancy font-semibold">Download .zip</span>
                  </div>
                </>
              )}
            </div>
          </button>
        </>
      ) : (
        <span>Error! No Download Information</span>
      )}
    </>
  );
}
