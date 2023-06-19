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
            className="self-center flex items-center bg-borderLight dark:bg-borderDark hover:bg-darkBorderLight hover:dark:bg-darkBorderDark transition-colors p-2 text-xl md:text-3xl rounded-full justify-between mt-4"
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
            <div className="bg-lightenerLight dark:bg-lightenerDark p-2 rounded-full">
              {installing && desktopMode ? <LoadingSpinner /> : <FiArrowDown size={48} />}
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
                  <span className="font-semibold ml-2 mr-1 md:mr-2">
                    {themeData.download.downloadCount}
                  </span>
                  <span className="pr-3">
                    Download
                    {themeData.download.downloadCount !== 1 ? "s" : ""}
                  </span>
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
