import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";
import { BsShare, BsStar, BsStarFill } from "react-icons/bs";
import { checkAndRefreshToken, genericGET } from "../../apiHelpers";
import {
  LoadingPage,
  SupporterIcon,
  ThemeAdminPanel,
  ThemeDownloadButton,
  ThemeImageCarousel,
} from "..";
import { FullCSSThemeInfo } from "../../types";
import { authContext } from "../../pages/_app";
import { toast } from "react-toastify";
import { BiCode } from "react-icons/bi";

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
      <div className="font-fancy flex-grow flex justify-center h-full w-full text-center lg:text-left">
        {themeData !== undefined ? (
          <>
            {/* bg-base-3-light dark:bg-base-3-dark */}
            <div className="flex flex-col items-center h-fit w-full max-w-7xl rounded-3xl p-4">
              {/* Theme name and author */}
              <div className="flex flex-col md:flex-row w-full gap-4 text-left flex-[75%]">
                <div className="flex flex-col gap-2 w-full">
                  <h1 className="font-extrabold text-3xl md:text-5xl text-center sm:text-left">
                    {themeData.name}
                  </h1>

                  <div className="flex flex-col sm:flex-row items-center just gap-4">
                    <Link href={`/users/view?userId=${themeData.author.id}`}>
                      <div className="flex flex-row items-center gap-1">
                        by
                        <div className="flex items-center">
                          <div className="">{themeData.specifiedAuthor}</div>
                          <SupporterIcon author={themeData.author} />
                        </div>
                      </div>
                    </Link>
                    <div className="flex w-full md:w-fit items-center justify-center gap-4">
                      <button
                        disabled={!accountInfo?.username}
                        onClick={() => {
                          if (accountInfo?.username) toggleStar();
                        }}
                        className={`h-fit font-bold border border-borders-base2-light dark:border-borders-base3-dark rounded-full text-xs px-4 py-2 justify-center text-fore-11-light dark:text-fore-11-dark flex items-center gap-2 ${
                          accountInfo?.username
                            ? "hover:scale-95 transition duration-150 hover:active:scale-90 select-none hover:bg-base-3-dark cursor-pointer"
                            : "cursor-auto"
                        }`}
                      >
                        {isStarred ? <BsStarFill /> : <BsStar />}{" "}
                        <span className="whitespace-nowrap">
                          {themeData.starCount} {themeData.starCount > 1 ? "stars" : "star"}
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          // @ts-ignore
                          if (navigator.canShare) {
                            navigator
                              .share({
                                title: "DeckThemes",
                                text: themeData.name,
                                url: `${process.env.NEXT_PUBLIC_SHARE_URL}/${themeData.id}`,
                              })
                              .catch((err) => {
                                console.log("error", err);
                              });
                            return;
                          }
                          navigator.clipboard.writeText(
                            `${process.env.NEXT_PUBLIC_SHARE_URL}/${themeData.id}`
                          );
                          toast("🔗 Link Copied To Clipboard", {
                            autoClose: 2000,
                            hideProgressBar: true,
                            pauseOnHover: false,
                          });
                        }}
                        className={`h-fit font-bold border border-borders-base2-light dark:border-borders-base3-dark rounded-full text-xs px-4 py-2 justify-center text-fore-11-light dark:text-fore-11-dark flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 select-none hover:bg-base-3-dark hover:text-fore-11-dark`}
                      >
                        <BsShare className="scale-x-90" /> <span className="">Share</span>
                      </button>
                      <ThemeAdminPanel themeData={themeData} />
                    </div>
                  </div>

                  <div className="text-md text-center sm:text-left max-w-2xl my-4">
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

                  <div className="my-4 self-center sm:self-start">
                    <ThemeDownloadButton themeData={themeData} />
                  </div>

                  <div className="flex flex-col items-center w-full max-w-7xl justify-center relative mt-8">
                    <div className="flex flex-row w-full items-center justify-center flex-wrap gap-4 h-fit relative p-6 border border-borders-base2-light dark:border-borders-base3-dark rounded-xl">
                      <div className="items-start flex flex-col gap-2 px-4 flex-1">
                        <h3 className="font-bold text-sm">Category</h3>
                        <p className="dark:text-fore-9-dark font-medium">{themeData.target}</p>
                      </div>

                      <div className="items-start flex flex-col gap-2 px-4 flex-1">
                        <h3 className="font-bold text-sm">Version</h3>
                        <p className="dark:text-fore-9-dark font-medium">{themeData.version}</p>
                      </div>

                      <div className="items-start flex flex-col gap-2 px-4 flex-1">
                        <h3 className="font-bold text-sm">Published</h3>
                        <p className="dark:text-fore-9-dark font-medium">
                          {new Date(themeData.submitted).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="items-start flex flex-col gap-2 px-4 flex-1">
                        <h3 className="font-bold text-sm">Updated</h3>
                        <p className="dark:text-fore-9-dark font-medium">
                          {new Date(themeData.updated).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="items-center sm:items-start flex flex-col gap-2 px-4 flex-1 border-t sm:border-t-0 sm:border-l dark:border-borders-base2-dark pt-4 mt-2 sm:pt-0 sm:mt-0 sm:pl-8 sm:ml-8">
                        <h3 className="font-bold text-sm">Resources</h3>
                        <p className="dark:text-fore-9-dark font-medium">
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
                                  className="h-fit font-bold border border-borders-base2-light dark:border-borders-base3-dark rounded-full text-xs px-4 py-2 justify-center text-fore-11-light dark:text-fore-11-dark flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 select-none hover:bg-base-3-dark hover:text-fore-11-dark"
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
                    </div>

                    <div className="w-full h-full flex items-center max-w-full mt-8">
                      <ThemeImageCarousel data={themeData} />
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
