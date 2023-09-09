import { useState } from "react";
import { fetchWithRefresh, genericGET } from "../../apiHelpers";
import { LoadingSpinner } from "../Generic";
import { RiRefreshLine } from "react-icons/ri";
import { SquishyButton } from "..";
import { BiCheckCircle, BiCopyAlt } from "react-icons/bi";

export function AccountKeyDisplay({ userId }: { userId?: string | undefined }) {
  const [accountKey, setAccountKey] = useState<string | undefined>();
  const [copied, setCopied] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  function generateAccountKey() {
    setAccountKey("LOADING");
    setCopied(false)
    genericGET(`/users/${userId ? userId : "me"}/token`).then((json) => {
      if (json?.token) {
        setAccountKey(json.token);
      }
    });
  }

  function copyAccountKey(key: string) {
    setCopied(true);
    navigator.clipboard.writeText(key);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }
  return (
    <div className="flex flex-col gap-4 border-borderLight p-4 dark:border-borderDark">
      <span className="font-fancy text-xl font-semibold">Connect Your Devices</span>
      <div className="flex flex-col items-center md:flex-row">
        <SquishyButton onClick={generateAccountKey}>
          <RiRefreshLine />
          <div className="font-fancy text-xs font-bold">
            {accountKey ? "Reg" : "G"}enerate Account Key
          </div>
        </SquishyButton>
        {accountKey ? (
          <>
            <div className="relative px-4 py-4 md:py-0">
              {accountKey === "LOADING" ? (
                <LoadingSpinner size={24} />
              ) : (
                <>
                  <div className="flex cursor-pointer flex-row items-center gap-2">
                    <span
                      className="transition-opacity duration-75"
                      // The reason I do this with opacity is so that the horizontal spacing doesn't jump around a bunch
                      style={{ fontFamily: "monospace, monospace" }}
                      onClick={() => copyAccountKey(accountKey)}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      {accountKey}
                    </span>
                    {!copied ? <BiCopyAlt /> : <BiCheckCircle fill="#07bc0c" />}
                    <div
                      className="pointer-events-none absolute left-1/2 -top-8 flex w-fit -translate-x-1/2 justify-center whitespace-nowrap rounded-full bg-black px-2 py-1 text-sm font-bold text-white transition-opacity duration-75 dark:text-blue-200 shadow-md"
                      style={{ opacity: hover ? "100%" : "0%" }}
                    >
                      {!copied ? <>Click To Copy</> : <>Copied</>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
