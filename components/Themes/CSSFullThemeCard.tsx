import { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { FiArrowDown } from "react-icons/fi";
import { genericGET } from "../../api";
import { ThemeImageCarousel } from "../../components";
import { FullCSSThemeInfo } from "../../types";

function MiniDivider() {
  return <div className="h-1 w-full bg-borderLight dark:bg-borderDark rounded-3xl" />;
}

export function CSSFullThemeCard({ parsedId }: { parsedId: string }) {
  const [themeData, setThemeData] = useState<FullCSSThemeInfo | undefined>(undefined);
  const [isStarred, setStarred] = useState<boolean>(false);

  async function getStarredStatus() {
    const isStarred = await genericGET(
      `/users/me/css_stars/${parsedId}`,
      "Starred Theme Fetch Failed!"
    );
    isStarred?.starred ? setStarred(true) : setStarred(false);
  }

  useEffect(() => {
    async function getThemeData() {
      const data = await genericGET(`/css_themes/${parsedId}`, "Theme Fetch Failed!");
      setThemeData(data);
      getStarredStatus();
    }
    getThemeData();
  }, [parsedId]);

  function toggleStar() {
    const pageServer = fetch(`${process.env.API_URL}/users/me/css_stars/${parsedId}`, {
      method: isStarred ? "DELETE" : "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok && res.status === 200) {
          if (themeData) {
            setThemeData({
              ...themeData,
              starCount: isStarred ? themeData.starCount - 1 : themeData.starCount + 1,
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

  return (
    <div className="flex-grow flex p-8 justify-center h-full mt-8 lg:mt-0 text-center lg:text-left">
      {themeData !== undefined ? (
        <>
          <div className="flex flex-col lg:flex-row items-center lg:items-start lg:mx-16 xl:mx-32 h-fit w-full p-4 bg-cardLight dark:bg-cardDark rounded-3xl">
            {themeData.images.length > 0 ? (
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

            <div className="flex flex-col items-center lg:items-start text-xl gap-2 my-4 lg:mx-8">
              <h1 className="text-3xl md:text-5xl font-semibold mb-auto max-w-[640px]">
                {themeData.name}
              </h1>
              <h3>
                Created By <span className="text-cyan-500">{themeData.specifiedAuthor}</span>
              </h3>
              <div className="flex justify-between w-full">
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
                {!themeData.description ? (
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
                        location.assign(`${process.env.API_URL}/blobs/${themeData.download.id}`);
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
            </div>
          </div>
        </>
      ) : (
        <span>Error! Invalid Theme ID</span>
      )}
    </div>
  );
}
