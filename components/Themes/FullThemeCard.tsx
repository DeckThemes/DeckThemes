import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { FiArrowDown } from "react-icons/fi";
import { checkAndRefreshToken, genericGET } from "../../api";
import { ThemeAdminPanel, ThemeImageCarousel } from "..";
import { FullCSSThemeInfo } from "../../types";

function MiniDivider() {
  return <div className="h-1 w-full bg-borderLight dark:bg-borderDark rounded-3xl" />;
}

export function FullThemeCard({ parsedId }: { parsedId: string }) {
  const [themeData, setThemeData] = useState<FullCSSThemeInfo | undefined>(undefined);
  const [isStarred, setStarred] = useState<boolean>(false);

  async function getStarredStatus() {
    const isStarred = await genericGET(`/users/me/stars/${parsedId}`);
    isStarred?.starred ? setStarred(true) : setStarred(false);
    if (isStarred && themeData?.starCount === 0) {
      setThemeData({
        ...themeData,
        starCount: 1,
      });
    }
  }

  useEffect(() => {
    async function getThemeData() {
      const data = await genericGET(`/themes/${parsedId}`);
      setThemeData(data);
      getStarredStatus();
    }
    getThemeData();
  }, [parsedId]);

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
          console.error("Error Setting Star On Theme", err);
        });
    }
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
              {themeData?.images.length > 0 ? (
                <>
                  <div className="w-full h-full flex items-center lg:items-start">
                    <ThemeImageCarousel data={themeData} />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl my-auto">No Images Provided</span>
                  </div>
                </>
              )}

              <div className="flex flex-col items-center lg:items-start text-xl gap-2 my-4 lg:mx-8 relative">
                <ThemeAdminPanel themeData={themeData} />
                <h1 className="text-3xl md:text-5xl font-semibold mb-auto max-w-[640px]">
                  {themeData.name}
                </h1>
                <Link href={`/users/view?userId=${themeData.author.id}`}>
                  <h3>
                    Created By <br className="flex md:hidden" />
                    <span className="text-blue-600 hover:text-blue-800 dark:text-cyan-500 hover:dark:text-cyan-700 underline transition-colors">
                      {themeData.specifiedAuthor}
                    </span>
                  </h3>
                </Link>
                <div className="flex justify-between w-full px-3 md:px-0">
                  <h3>{themeData.target}</h3>
                  <h3>{themeData.version}</h3>
                </div>
                <div className="flex  w-full items-center gap-2">
                  <MiniDivider />
                  <button
                    onClick={toggleStar}
                    className="flex items-center gap-2 bg-borderLight dark:bg-borderDark hover:bg-bgLight hover:dark:bg-bgDark pl-2 pr-3 transition-all rounded-2xl"
                  >
                    {isStarred ? <BsStarFill /> : <BsStar />} <span>{themeData.starCount}</span>
                  </button>
                  <MiniDivider />
                </div>
                <div className="text-md max-w-[640px]">
                  {themeData.description ? (
                    <span>{themeData.description}</span>
                  ) : (
                    <span className="text-textFadedLight dark:text-textFadedDark">
                      <i>No Description Provided</i>
                    </span>
                  )}
                </div>
                {themeData.download !== undefined ? (
                  <>
                    <button
                      className="self-center flex items-center bg-borderLight dark:bg-borderDark hover:bg-darkBorderLight hover:dark:bg-darkBorderDark transition-colors p-2 text-3xl rounded-full justify-between mt-4"
                      onClick={() => {
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
                        <span className="font-semibold ml-2 mr-2">
                          {themeData.download.downloadCount}
                        </span>
                        <span className="pr-3">
                          Download
                          {themeData.download.downloadCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </button>
                  </>
                ) : (
                  <span>Error! No Download Information</span>
                )}
                <div className="text-sm max-w-[640px]">
                  {themeData.source ? (
                    <span>
                      <span className="text-textFadedLight dark:text-textFadedDark">Source:</span>{" "}
                      {themeData.source}
                    </span>
                  ) : (
                    <span className="text-textFadedLight dark:text-textFadedDark">
                      <i>No Source Provided</i>
                    </span>
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
