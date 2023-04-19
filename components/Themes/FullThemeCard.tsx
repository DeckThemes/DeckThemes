import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { BsShare, BsStar, BsStarFill } from "react-icons/bs";
import { FiArrowDown } from "react-icons/fi";
import { checkAndRefreshToken, genericGET } from "../../api";
import { LoadingPage, SupporterIcon, ThemeAdminPanel, ThemeImageCarousel } from "..";
import { FullCSSThemeInfo } from "../../types";
import { authContext, desktopModeContext } from "../../pages/_app";
import { toast } from "react-toastify";

function MiniDivider() {
  return <div className="h-1 w-full bg-borderLight dark:bg-borderDark rounded-3xl" />;
}

export function FullThemeCard({
  parsedId,
  hideAdminMenu = false,
}: {
  parsedId: string;
  hideAdminMenu?: boolean;
}) {
  const [themeData, setThemeData] = useState<FullCSSThemeInfo | undefined>(undefined);
  const [isStarred, setStarred] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const { accountInfo } = useContext(authContext);
  const { desktopMode } = useContext(desktopModeContext);

  async function getStarredStatus() {
    const isStarred = await genericGET(`/users/me/stars/${parsedId}`);
    isStarred?.starred ? setStarred(true) : setStarred(false);
    // This is just a fix for when you've starred a theme, but the server hasn't updated and still displays 0 stars
    if (isStarred?.starred && themeData?.starCount === 0) {
      setThemeData({
        ...themeData,
        starCount: 1,
      });
    }
  }

  useEffect(() => {
    if (parsedId) {
      genericGET(`/themes/${parsedId}`).then((data) => {
        setThemeData(data);
        setLoaded(true);
      });
    }
    if (accountInfo?.username) {
      getStarredStatus();
    }
  }, [parsedId, accountInfo]);

  async function toggleStar() {
    const waitForRefresh = await checkAndRefreshToken();
    if (waitForRefresh) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/stars/${parsedId}`, {
        method: isStarred ? "DELETE" : "POST",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok && res.status === 200) {
            if (themeData) {
              setThemeData({
                ...themeData,
                starCount: isStarred
                  ? themeData.starCount === 0
                    ? // This stops it from going below 0
                      themeData.starCount
                    : themeData.starCount - 1
                  : themeData.starCount + 1,
              });
            }
            getStarredStatus();
          } else {
            throw new Error("Response Not Ok!");
          }
        })
        .catch((err) => {
          toast.error(`Error Starring Theme! ${JSON.stringify(err)}`);
          console.error("Error Setting Star On Theme", err);
        });
    }
  }
  if (!loaded) {
    return <LoadingPage />;
  }

  return (
    <>
      <Head>
        <title>{themeData?.name ? `${themeData.name} | DeckThemes` : "DeckThemes"}</title>
      </Head>
      <div className="flex-grow flex p-8 justify-center h-full w-full mt-8 lg:mt-0 text-center lg:text-left">
        {themeData !== undefined ? (
          <>
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:mx-16 xl:mx-32 h-fit w-full p-4 bg-cardLight dark:bg-cardDark rounded-3xl">
              <>
                <div className="w-full h-full flex items-center lg:items-start">
                  <ThemeImageCarousel data={themeData} />
                </div>
              </>
              <div className="flex flex-col items-center lg:items-start text-xl gap-2 my-4 lg:mx-8 relative">
                {!hideAdminMenu && <ThemeAdminPanel themeData={themeData} />}
                <h1 className="text-3xl md:text-5xl font-semibold mb-auto max-w-[640px]">
                  {themeData.name}
                </h1>
                <Link
                  href={`/users/view?userId=${themeData.author.id}`}
                  className="flex flex-col md:flex-row gap-1"
                >
                  <h3>Created By </h3>
                  <div className="flex items-center">
                    <span className="text-blue-600 hover:text-blue-800 dark:text-cyan-500 hover:dark:text-cyan-700 underline transition-colors font-fancy">
                      {themeData.specifiedAuthor}
                    </span>
                    <SupporterIcon author={themeData.author} />
                  </div>
                </Link>
                <div className="flex justify-between w-full px-3 md:px-0">
                  <h3>{themeData.target}</h3>
                  <h3>{themeData.version}</h3>
                </div>
                <div className="flex  w-full items-center gap-2">
                  <MiniDivider />
                  <button
                    onClick={() => {
                      if (accountInfo?.username) toggleStar();
                    }}
                    className={`flex items-center gap-2 bg-borderLight dark:bg-borderDark ${
                      accountInfo?.username
                        ? "hover:bg-bgLight hover:dark:bg-bgDark cursor-pointer"
                        : "cursor-auto"
                    } px-2 transition-all rounded-2xl`}
                  >
                    {isStarred ? <BsStarFill /> : <BsStar />}{" "}
                    <span className="-translate-y-[1.5px]">{themeData.starCount}</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_SHARE_URL}/${themeData.id}`
                      );
                      toast("🔗 Link Copied To Clipboard", {
                        autoClose: 2000,
                        hideProgressBar: true,
                        pauseOnHover: false,
                      });
                    }}
                    className={`flex items-center gap-2 bg-borderLight dark:bg-borderDark hover:bg-bgLight hover:dark:bg-bgDark cursor-pointer px-2 transition-all rounded-2xl`}
                  >
                    <BsShare className="scale-x-90" />{" "}
                    <span className="-translate-y-[1.5px]">Share</span>
                  </button>
                  <MiniDivider />
                </div>
                <div className="text-md max-w-[640px]">
                  {themeData.description ? (
                    <span className="whitespace-pre-line break-words">{themeData.description}</span>
                  ) : (
                    <span className="text-textFadedLight dark:text-textFadedDark">
                      <i>No Description Provided</i>
                    </span>
                  )}
                </div>
                {themeData.download !== undefined ? (
                  <>
                    <button
                      className="self-center flex items-center bg-borderLight dark:bg-borderDark hover:bg-darkBorderLight hover:dark:bg-darkBorderDark transition-colors p-2 text-xl md:text-3xl rounded-full justify-between mt-4"
                      onClick={() => {
                        if (desktopMode) {
                          window.parent.postMessage(
                            {
                              action: "installTheme",
                              payload: themeData.id,
                            },
                            "http://localhost:3000"
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
                        <FiArrowDown size={48} />
                      </div>
                      <div>
                        {desktopMode ? (
                          <>
                            <span>Install</span>
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
                <div className="text-sm max-w-[640px]">
                  {themeData.source ? (
                    <>
                      <span className="text-textFadedLight dark:text-textFadedDark">Source:</span>{" "}
                      {themeData.source.slice(0, 5) === "https" ? (
                        <a
                          href={themeData.source.slice(0, themeData.source.lastIndexOf("@") - 1)}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-blue-600 hover:text-blue-800 dark:text-cyan-500 hover:dark:text-cyan-700"
                        >
                          {themeData.source}
                        </a>
                      ) : (
                        <span>{themeData.source}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-textFadedLight dark:text-textFadedDark">
                      <i>No Source Provided</i>
                    </span>
                  )}
                  <br />
                  <span>
                    <span className="text-textFadedLight dark:text-textFadedDark">
                      Last Updated:
                    </span>{" "}
                    {new Date(themeData.updated).toLocaleString()}
                  </span>
                  <br />
                  {themeData.dependencies.length > 0 && (
                    <>
                      <span>
                        <span className="text-textFadedLight dark:text-textFadedDark">
                          Depends On:
                        </span>{" "}
                        {themeData.dependencies.map((e, i, arr) => (
                          <Link
                            key={`Dependency ${i}`}
                            href={`/themes/view?themeId=${e.id}`}
                            className="underline"
                          >
                            {e.name}
                            {i < arr.length - 1 ? ", " : ""}
                          </Link>
                        ))}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <span>Error! Invalid Theme ID</span>
        )}
      </div>
    </>
  );
}
