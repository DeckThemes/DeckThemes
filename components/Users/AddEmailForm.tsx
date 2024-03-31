import { useContext, useState } from "react";
import { fetchWithRefresh, genericFetch, genericGET } from "../../apiHelpers";
import { LoadingSpinner } from "../Generic";
import { authContext } from "contexts";
import { LabelledInput, SquishyButton } from "@components/Primitives";
import { SiMaildotru } from "react-icons/si";
import * as Collapsible from "@radix-ui/react-collapsible";
import { toast } from "react-toastify";
import { FaCaretDown } from "react-icons/fa";

export function AddEmailForm({ userId }: { userId?: string | undefined }) {
  const { accountInfo } = useContext(authContext);
  const [inputValue, setInputValue] = useState<string>(accountInfo?.email || "");

  const [loading, setLoading] = useState<boolean>(false);

  async function emailUpdateFetch(emailValue: string, onFinish: () => void) {
    setLoading(true);
    await genericFetch(
      "/users/me",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      },
      true
    )
      .then(onFinish)
      .catch((_err) => {
        toast("Error Updating Email");
      });
    setLoading(false);
  }

  function onFormSubmit() {
    if (inputValue.length === 0) {
      toast("Enter a Valid Email");
      return;
    }
    emailUpdateFetch(inputValue, () => toast("Email Updated"));
  }
  function removeEmail() {
    emailUpdateFetch("", () => {
      setInputValue("");
      toast("Unsubscribed");
    });
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col items-start justify-center gap-2">
        <span className="font-fancy text-xl font-semibold">Email</span>
        <span className="font-fancy text-sm font-medium text-textFadedLight dark:text-textFadedDark">
          Get Email Updates on Your Submissions
        </span>
      </div>
      <Collapsible.Root className="group">
        <Collapsible.Trigger asChild>
          <SquishyButton>
            <SiMaildotru />
            <div className="font-fancy text-xs font-bold">Edit Email</div>
            <FaCaretDown
              className="relative transition-transform ease-in group-data-[state=open]:-rotate-180"
              aria-hidden
            />
          </SquishyButton>
        </Collapsible.Trigger>
        <Collapsible.Content className="CollapsibleContent">
          <div className="flex items-end justify-start gap-2 py-4">
            <div className="w-72">
              <LabelledInput
                label="Email"
                // We don't actually want the "Please fill out this field" error as when you want to unsubscribe it will be empty
                inputType="email"
                value={inputValue}
                onValueChange={(e) => setInputValue(e)}
              />
            </div>
            {loading ? (
              <>
                <div className="ml-4 flex h-12 items-center justify-center">
                  <LoadingSpinner size={24} />
                </div>
              </>
            ) : (
              <>
                <SquishyButton
                  customClass="h-12 rounded-xl"
                  buttonProps={{ disabled: loading, type: "submit" }}
                  onClick={onFormSubmit}
                >
                  <div className="font-fancy text-xs font-bold">Submit Email</div>
                </SquishyButton>
                {accountInfo?.email && (
                  <SquishyButton
                    customClass="h-12 border-red-500 hover:bg-red-600 rounded-xl"
                    buttonProps={{ disabled: loading, type: "button" }}
                    onClick={() => removeEmail()}
                  >
                    <div className="font-fancy text-xs font-bold">Unsubscribe</div>
                  </SquishyButton>
                )}
              </>
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
