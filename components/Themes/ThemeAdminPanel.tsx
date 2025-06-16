import { MenuDropdown } from "@components/Primitives";
import { authContext } from "contexts";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiEditAlt, BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";
import { genericFetch } from "../../apiHelpers";
import { FullCSSThemeInfo, Permissions } from "../../types";

export function ThemeAdminPanel({ themeData }: { themeData: FullCSSThemeInfo }) {
  const { accountInfo } = useContext(authContext);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const router = useRouter();

  function deleteTheme() {
    if (themeData) {
      const enteredName = prompt(
        `Are you sure you want to delete this theme? \nType "${themeData.name}" below to confirm.`
      );
      if (enteredName === themeData.name) {
        genericFetch(
          `/themes/${themeData.id}`,
          {
            method: "DELETE",
          },
          true
        )
          .then((success) => {
            if (success) {
              alert("Theme Successfully Deleted");
              return;
            }
            throw new Error(`Res Not OK!`);
          })
          .catch((err) => {
            toast.error(
              `Error Deleting Theme! ${JSON.stringify(err instanceof Error ? err.message : err)}`
            );
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
    genericFetch(
      `/themes/${themeData.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description,
          target: target,
          author: author,
        }),
      },
      true
    )
      .then((success) => {
        if (success) {
          alert("Edited Successfully");
          location.reload();
        }
      })
      .catch((err) => {
        toast.error(
          `Error Changing Meta! ${JSON.stringify(err instanceof Error ? err.message : err)}`
        );
        console.error(err);
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
                      onSelect: () => router.push("/submit?update=1"),
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
