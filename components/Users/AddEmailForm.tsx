import { useContext, useState } from "react";
import { fetchWithRefresh, genericFetch, genericGET } from "../../apiHelpers";
import { LoadingSpinner } from "../Generic";
import { authContext } from "contexts";
import { LabelledInput } from "@components/Primitives";
import { SiMaildotru } from "react-icons/si";
import * as Collapsible from "@radix-ui/react-collapsible";
import { toast } from "react-toastify";

export function AddEmailForm({ userId }: { userId?: string | undefined }) {
  const { accountInfo } = useContext(authContext);
  const [inputValue, setInputValue] = useState<string>(accountInfo?.email || "");

  function onFormSubmit(e: any) {
    e.preventDefault();
    genericFetch(
      "/users/me",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inputValue }),
      },
      true
    ).then(() => {
      console.log("test");
      toast("test");
    });
    console.log(inputValue);
  }

  return (
    <form onSubmit={onFormSubmit} className="flex w-96 flex-col gap-4 p-4">
      <div className="flex flex-col items-start justify-center gap-2">
        <span className="font-fancy text-xl font-semibold">Email</span>
        <span className="font-fancy text-sm font-medium text-textFadedLight dark:text-textFadedDark">
          Get Email Updates on Your Submissions
        </span>
      </div>
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <button className="flex h-fit w-fit select-none items-center gap-2 rounded-full border border-borders-base3-dark py-2 px-4 text-textLight transition duration-150 hover:scale-95 hover:bg-base-3-dark hover:text-bgDark hover:active:scale-90 dark:text-textDark dark:hover:text-bgLight">
            <SiMaildotru />
            <div className="font-fancy text-xs font-bold">Edit Email</div>
          </button>
        </Collapsible.Trigger>
        <Collapsible.Content className="CollapsibleContent">
          <div className="flex items-end justify-center gap-2 py-4">
            <LabelledInput
              inputProps={{ required: true }}
              label="Email"
              customClass="valid:bg-red-800"
              inputType="email"
              value={inputValue}
              onValueChange={(e) => setInputValue(e)}
            />
            <button
              type="submit"
              className="flex h-fit w-fit select-none items-center gap-2 rounded-xl border border-borders-base3-dark py-2 px-4 text-textLight transition duration-150 hover:scale-95 hover:bg-base-3-dark hover:text-bgDark hover:active:scale-90 dark:text-textDark dark:hover:text-bgLight"
            >
              <div className="font-fancy text-xs font-bold">Submit Email</div>
            </button>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </form>
  );
}
