import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import {
  BsCloudUploadFill,
  BsStar,
  BsStarFill,
  BsThreeDotsVertical,
  BsXCircleFill,
} from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { FiArrowDown } from "react-icons/fi";
import { checkAndRefreshToken, genericGET } from "../../api";
import { ThemeImageCarousel } from "../../components";
import { authContext } from "../../pages/_app";
import { FullCSSThemeInfo, Permissions } from "../../types";

function MiniDivider() {
  return <div className="h-1 w-full bg-borderLight dark:bg-borderDark rounded-3xl" />;
}

export function CSSFullThemeCard({ parsedId }: { parsedId: string }) {
  const { accountInfo } = useContext(authContext);

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

  async function toggleStar() {
    const waitForRefresh = await checkAndRefreshToken();
    if (waitForRefresh) {
      fetch(`${process.env.API_URL}/users/me/css_stars/${parsedId}`, {
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
  }

  function deleteTheme() {
    if (themeData) {
      const enteredName = prompt(
        `Are you sure you want to delete this theme? \nType "${themeData.name}" below to confirm.`
      );
      if (enteredName === themeData.name) {
        console.log("test");
        fetch(`${process.env.API_URL}/css_themes/${themeData.id}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((res) => {
            if (res.ok && res.status === 200) {
              alert("Theme Successfully Deleted");
            }
            throw new Error(`Res Not OK! Error Code ${res.status}`);
          })
          .catch((err) => {
            console.error("Delete Request Failed!", err);
          });
      } else {
        alert("Incorrect Name Entered");
      }
    }
  }
  function changeMeta() {
    let description = prompt("Enter A New Description (Leave blank to not change)");
    let author = prompt("Enter A New Author Field (Leave blank to not change)");
    let target = prompt("Enter A New Target Field (Leave blank to not change)");
    if (!description) {
      description = null;
    }
    if (!author) {
      author = null;
    }
    if (!target) {
      target = null;
    }

    console.log("test", description, author, target);
    fetch(`${process.env.API_URL}/css_themes/${themeData?.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: description,
        target: target,
        author: author,
      }),
    })
      .then((res) => {
        if (res.ok && res.status === 200) {
          alert("Edited Successfully");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  return (
    <div className="flex-grow flex p-8 justify-center h-full mt-8 lg:mt-0 text-center lg:text-left">
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
              {themeData.author.id === accountInfo?.id ||
              accountInfo?.permissions.includes(Permissions.editAny) ? (
                <>
                  <div
                    className="absolute right-0 flex flex-col items-end transition-all"
                    onMouseEnter={() => setShowAdminModal(true)}
                    onMouseLeave={() => setShowAdminModal(false)}
                  >
                    <button
                      className="bg-borderLight dark:bg-borderDark hover:bg-bgLight hover:dark:bg-bgDark transition-all p-2 rounded-full"
                      onClick={() => setShowAdminModal(!showAdminModal)}
                    >
                      <BsThreeDotsVertical />
                    </button>
                    {showAdminModal && (
                      <>
                        {/* <div
                          className="bg-red-800 absolute w-[300vw] h-[300vh] z-10 translate-x-1/2 -translate-y-1/2"
                          onClick={() => setShowAdminModal(false)}
                        /> */}
                        {accountInfo.permissions.includes(Permissions.editAny) ? (
                          <>
                            <button
                              className={`flex bg-borderLight dark:bg-borderDark hover:bg-bgLight hover:dark:bg-bgDark transition p-1 rounded-full items-center gap-2 px-2`}
                              onClick={changeMeta}
                            >
                              <BiEditAlt />
                              <span>Change Meta</span>
                            </button>
                          </>
                        ) : null}
                        <button
                          className={`flex bg-borderLight dark:bg-borderDark hover:bg-bgLight hover:dark:bg-bgDark transition p-1 rounded-full items-center gap-2 px-2`}
                          onClick={deleteTheme}
                        >
                          <BsXCircleFill className="text-red-500" />
                          <span>Delete Theme</span>
                        </button>
                        {themeData.author.id === accountInfo?.id && (
                          <>
                            <Link
                              href="/submit"
                              className={`flex bg-borderLight dark:bg-borderDark hover:bg-bgLight hover:dark:bg-bgDark transition p-1 rounded-full items-center gap-2 px-2`}
                            >
                              <BsCloudUploadFill />
                              <span>Update Theme</span>
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </>
              ) : null}
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
