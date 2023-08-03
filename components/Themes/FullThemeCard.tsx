import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { BsShare, BsStar, BsStarFill } from "react-icons/bs";
import { checkAndRefreshToken, genericFetch, genericGET } from "../../apiHelpers";
import {
  ThemeViewLoadingPage,
  SupporterIcon,
  ThemeAdminPanel,
  ThemeDownloadButton,
  ThemeImageCarousel,
  MiniThemeCardRoot,
} from "..";
import { FullCSSThemeInfo } from "../../types";
import { authContext, desktopModeContext } from "contexts";
import { toast } from "react-toastify";
import { BiCode } from "react-icons/bi";

export function FullThemeCard({
  parsedId,
  hideAdminMenu = false,
}: {
  parsedId: string;
  hideAdminMenu?: boolean;
}) {
  const { desktopMode } = useContext(desktopModeContext);

  const [themeData, setThemeData] = useState<FullCSSThemeInfo | undefined>(undefined);
  const [depData, setDepData] = useState<FullCSSThemeInfo[] | undefined>([]);
  const [isStarred, setStarred] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const { accountInfo } = useContext(authContext);

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

  async function getThemeData() {
    if (parsedId) {
      const data: FullCSSThemeInfo = await genericGET(`/themes/${parsedId}`);
      if (!data) return;
      setThemeData(data);
      if (data.dependencies.length === 0) {
        setDepData([]);
      } else {
        const depData = await Promise.all(
          data.dependencies.map((e) => genericGET(`/themes/${e.id}`))
        );
        depData && setDepData(depData);
      }
    }
    setLoaded(true);
  }

  useEffect(() => {
    setLoaded(false);
    getThemeData();
    if (accountInfo?.username) {
      getStarredStatus();
    }
  }, [parsedId, accountInfo]);

  async function toggleStar() {
    const waitForRefresh = await checkAndRefreshToken();
    if (waitForRefresh) {
      genericFetch(`/users/me/stars/${parsedId}`, { method: isStarred ? "DELETE" : "POST" }, true)
        .then((success) => {
          if (success) {
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
    return <ThemeViewLoadingPage />;
  }

  return (
    <>
      <Head>
        <title>{themeData?.name ? `${themeData.name} | DeckThemes` : "DeckThemes"}</title>
      </Head>
      <div className="font-fancy flex h-full w-full flex-grow justify-center text-center lg:text-left">
        {themeData !== undefined ? (
          <>
            {/* bg-base-3-light dark:bg-base-3-dark */}
            <div className="flex h-fit w-full max-w-7xl flex-col items-center rounded-3xl">
              {/* Theme name and author */}
              <div className="flex w-full flex-[75%] flex-col gap-4 text-left md:flex-row">
                <div className="flex w-full flex-col gap-4">
                  <h1 className="text-center text-3xl font-extrabold sm:text-left md:text-5xl">
                    {themeData.name}
                  </h1>

                  <div className="flex w-full flex-col items-center gap-4 self-center pb-4 sm:hidden">
                    <Link href={`/users/view?userId=${themeData.author.id}`} className="w-fit">
                      <div className="flex flex-row items-center gap-1">
                        by
                        <div className="flex items-center">
                          <div>{themeData.specifiedAuthor}</div>
                          <SupporterIcon author={themeData.author} />
                        </div>
                      </div>
                    </Link>
                    <div className="flex h-full w-full max-w-full items-center">
                      <ThemeImageCarousel data={themeData} />
                    </div>
                  </div>

                  <div className="just flex flex-col items-center gap-4 sm:flex-row">
                    <Link
                      href={`/users/view?userId=${themeData.author.id}`}
                      className="hidden w-fit sm:flex"
                    >
                      <div className="flex flex-row items-center gap-1">
                        by
                        <div className="flex items-center">
                          <div className="">{themeData.specifiedAuthor}</div>
                          <SupporterIcon author={themeData.author} />
                        </div>
                      </div>
                    </Link>

                    <div className="flex w-full items-center justify-center gap-4 sm:w-fit">
                      <button
                        disabled={!accountInfo?.username}
                        onClick={() => {
                          if (accountInfo?.username) toggleStar();
                        }}
                        className={`flex h-fit items-center justify-center gap-2 rounded-full border border-borders-base2-light px-4 py-2 text-xs font-bold text-fore-11-light dark:border-borders-base3-dark dark:text-fore-11-dark ${
                          accountInfo?.username
                            ? "cursor-pointer select-none transition duration-150 hover:scale-95 hover:bg-base-3-dark hover:active:scale-90"
                            : "cursor-auto"
                        }`}
                      >
                        {isStarred ? <BsStarFill /> : <BsStar />}{" "}
                        <span className="whitespace-nowrap">
                          {themeData.starCount}{" "}
                          {themeData.starCount > 1 || themeData.starCount === 0 ? "stars" : "star"}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          function fallbackShare() {
                            navigator.clipboard.writeText(
                              `${process.env.NEXT_PUBLIC_SHARE_URL}/${themeData!.id}`
                            );
                            toast.info("🔗 Link Copied To Clipboard", {
                              autoClose: 2000,
                              hideProgressBar: true,
                              pauseOnHover: false,
                            });
                          }

                          // @ts-ignore
                          if (navigator.canShare) {
                            navigator
                              .share({
                                title: "DeckThemes",
                                text: themeData.name,
                                url: `${process.env.NEXT_PUBLIC_SHARE_URL}/${themeData.id}`,
                              })
                              .catch((err) => {
                                console.log("Error Using navigator.share()", err);
                                fallbackShare();
                              });
                            return;
                          }
                          fallbackShare();
                        }}
                        className={`flex h-fit select-none items-center justify-center gap-2 rounded-full border border-borders-base2-light px-4 py-2 text-xs font-bold text-fore-11-light transition duration-150 hover:scale-95 hover:bg-base-3-dark hover:text-fore-11-dark hover:active:scale-90 dark:border-borders-base3-dark dark:text-fore-11-dark`}
                      >
                        <BsShare className="scale-x-90" /> <span>Share</span>
                      </button>
                      {!hideAdminMenu && <ThemeAdminPanel themeData={themeData} />}
                    </div>
                  </div>

                  <div className="text-md mb-4 max-w-2xl text-left">
                    {themeData.description ? (
                      <span className="whitespace-pre-line break-words">
                        {themeData.description}
                      </span>
                    ) : (
                      <span className="text-textFadedLight dark:text-textFadedDark">
                        <i>No Description Provided</i>
                      </span>
                    )}
                  </div>

                  <div className="my-4 flex flex-col items-center justify-center gap-2 self-center sm:flex-row sm:self-start">
                    <ThemeDownloadButton themeData={themeData} />
                    <span className="font-fancy text-textFadedLight dark:text-textFadedDark">
                      {themeData.download.downloadCount} Download
                      {themeData.download.downloadCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="relative mt-8 flex w-full max-w-7xl flex-col items-center justify-center gap-6 md:flex-row">
                    <div className="hidden h-full w-full max-w-full items-center sm:flex">
                      <ThemeImageCarousel data={themeData} />
                    </div>
                    <div className="relative flex h-fit w-full flex-row flex-wrap items-center justify-center gap-4 rounded-xl border border-borders-base2-light p-6 dark:border-borders-base3-dark md:h-full md:w-fit md:flex-col md:items-start md:justify-between lg:py-10">
                      <div className="flex flex-col items-start gap-2 px-4">
                        <h3 className="text-sm font-bold">Category</h3>
                        <p className="font-medium dark:text-fore-9-dark">{themeData.target}</p>
                      </div>
                      <div className="flex flex-col items-start gap-2 px-4">
                        <h3 className="text-sm font-bold">Version</h3>
                        <p className="font-medium dark:text-fore-9-dark">{themeData.version}</p>
                      </div>
                      <div className="flex flex-col items-start gap-2 px-4">
                        <h3 className="text-sm font-bold">Published</h3>
                        <p className="font-medium dark:text-fore-9-dark">
                          {new Date(themeData.submitted).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-2 px-4">
                        <h3 className="text-sm font-bold">Updated</h3>
                        <p className="font-medium dark:text-fore-9-dark">
                          {new Date(themeData.updated).toLocaleDateString()}
                        </p>
                      </div>
                      {!desktopMode && (
                        <div className="mt-2 flex flex-col items-center gap-2 px-4 sm:mt-0 sm:items-start">
                          <h3 className="text-sm font-bold">Resources</h3>
                          <p className="font-medium dark:text-fore-9-dark">
                            {themeData.source ? (
                              <>
                                {themeData.source.slice(0, 5) === "https" ? (
                                  <a
                                    href={themeData.source.slice(
                                      0,
                                      themeData.source.lastIndexOf("@") - 1
                                    )}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-fit select-none items-center justify-center gap-2 whitespace-nowrap rounded-full border border-borders-base2-light px-4 py-2 text-xs font-bold text-fore-11-light transition duration-150 hover:scale-95 hover:bg-base-3-dark hover:text-fore-11-dark hover:active:scale-90 dark:border-borders-base3-dark dark:text-fore-11-dark"
                                  >
                                    <BiCode />
                                    Source code
                                  </a>
                                ) : (
                                  <span>{themeData.source}</span>
                                )}
                              </>
                            ) : (
                              <span className="text-textFadedLight dark:text-textFadedDark">
                                <i>No source available</i>
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* theme img */}
              <>
                {/* md breakpoints work, but are uncomfortably close to screen edge. */}
                {/* <div className="flex flex-col xl:flex-row w-full max-w-7xl justify-center relative xl:pr-48 xl:-mr-48 mb-12">
                  <div className="w-full h-full flex items-center lg:items-start xl:max-w-4xl max-w-full">
                    <ThemeImageCarousel data={themeData} />
                  </div> */}
              </>

              {depData && depData.length > 0 && (
                <div className="flex w-full flex-col items-center gap-4 pt-20 sm:items-start">
                  <span className="text-3xl font-bold">Dependencies</span>
                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {depData?.map((e, i) => {
                      return <MiniThemeCardRoot data={e} key={`DEP_${i}`} />;
                    })}
                  </div>
                </div>
              )}

              {/* everything else */}
              {/* <div className="text-sm max-w-[640px]">

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
                </div> */}
            </div>
          </>
        ) : (
          <span>Error! Invalid Theme ID</span>
        )}
      </div>
    </>
  );
}
