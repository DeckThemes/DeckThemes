import { BiEditAlt, BiTrash } from "react-icons/bi";
import { authContext } from "../../pages/_app";
import { useContext, useState } from "react";
import { FullCSSThemeInfo, Permissions } from "../../types";
import { fetchWithRefresh } from "../../apiHelpers";
import { toast } from "react-toastify";
import { MenuDropdown } from "@components/Primitives";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useRouter } from "next/router";

export function ThemeAdminPanel({
  themeData,
}: {
  themeData: FullCSSThemeInfo;
}) {
  const { accountInfo } = useContext(authContext);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const router = useRouter();

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
            toast.error(`Error Deleting Theme! ${JSON.stringify(err)}`);
            console.error("Delete Request Failed!", err);
          });
      } else {
        alert("Incorrect Name Entered");
      }
    }
  }
  function changeMeta() {
    let description = prompt(
      "Enter A New Description (Leave blank to not change)"
    );
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
          toast.error(`Error Changing Meta! ${JSON.stringify(err)}`);
          console.error(err);
        });
    });
  }

  return (
    <>
      {themeData.author.id === accountInfo?.id ||
      accountInfo?.permissions.includes(Permissions.editAny) ? (
        <>
          <MenuDropdown
            options={[
              ...(themeData.author.id === accountInfo?.id
                ? [
                    {
                      displayText: "Update Theme",
                      icon: <AiOutlineCloudUpload size={20} />,
                      onSelect: () => router.push("/submit"),
                    },
                  ]
                : []),
              ...(accountInfo.permissions.includes(Permissions.editAny)
                ? [
                    {
                      displayText: "Change Theme Meta",
                      icon: <BiEditAlt size={20} />,
                      onSelect: () => changeMeta(),
                    },
                    {
                      displayText: "Delete Theme",
                      icon: <BiTrash size={20} />,
                      onSelect: () => deleteTheme(),
                    },
                  ]
                : []),
            ]}
          />
        </>
      ) : null}
    </>
  );
}
