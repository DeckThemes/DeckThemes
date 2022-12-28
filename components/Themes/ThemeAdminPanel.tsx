import { BiEditAlt } from "react-icons/bi";
import { BsCloudUploadFill, BsThreeDotsVertical, BsXCircleFill } from "react-icons/bs";
import Link from "next/link";
import { authContext } from "../../pages/_app";
import { useContext, useState } from "react";
import { FullCSSThemeInfo, Permissions } from "../../types";
import { fetchWithRefresh } from "../../api";

export function ThemeAdminPanel({ themeData }: { themeData: FullCSSThemeInfo }) {
  const { accountInfo } = useContext(authContext);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  function deleteTheme() {
    if (themeData) {
      const enteredName = prompt(
        `Are you sure you want to delete this theme? \nType "${themeData.name}" below to confirm.`
      );
      if (enteredName === themeData.name) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/themes/${themeData.id}`, {
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
    let author = prompt("Enter A New Author ID (Leave blank to not change)");
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
    fetchWithRefresh(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/themes/${themeData?.id}`, {
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
            location.reload();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  return (
    <>
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
    </>
  );
}
