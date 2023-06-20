import { FiArrowDown } from "react-icons/fi";
import { LoadingSpinner } from "../Generic";
import { FullCSSThemeInfo } from "../../types";
import { desktopModeContext } from "../../pages/_app";
import { useContext } from "react";

export function ThemeDownloadButton({ themeData }: { themeData: FullCSSThemeInfo }) {
  const { desktopMode, installing, setInstalling } = useContext(desktopModeContext);
  return (
    <>
      {themeData.download !== undefined ? (
        <>
          <button
            className="w-fit gap-2 mb-2 sm:mb-0 group no-underline inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-brandBlue text-white hover:bg-fore-11-dark hover:text-fore-contrast-dark active:opacity-60 border-2 border-borders-base1-light hover:border-borders-base2-light dark:border-borders-base1-dark hover:dark:border-borders-base2-dark transition"
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
            <div className="flex items-center justify-center  rounded-full w-6 h-6">
              {installing && desktopMode ? <LoadingSpinner /> : <FiArrowDown size={12} />}
            </div>
            <div>
              {desktopMode ? (
                <>
                  <div className="flex flex-col items-center justify-center ml-2 mr-3">
                    <span className="font-semibold font-fancy">Install</span>
                  </div>
                </>
              ) : (
                <>
				<div className="flex flex-col items-center justify-center ml-2 mr-3">
                    <span className="font-semibold font-fancy">Download .zip</span>
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
