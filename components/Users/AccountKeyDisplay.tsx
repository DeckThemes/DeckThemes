import { useState } from "react";
import { fetchWithRefresh, genericGET } from "../../apiHelpers";
import { LoadingSpinner } from "../Generic";
import { RiRefreshLine } from "react-icons/ri";
import { SquishyButton } from "..";

export function AccountKeyDisplay({ userId }: { userId?: string | undefined }) {
  const [accountKey, setAccountKey] = useState<string | undefined>();
  const [hover, setHover] = useState<boolean>(false);
  function generateAccountKey() {
    setAccountKey("LOADING");
    genericGET(`/users/${userId ? userId : "me"}/token`).then((json) => {
      if (json?.token) {
        setAccountKey(json.token);
      }
    });
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
                  <div className="cursor-pointer underline">
                    <span
                      className="transition-opacity duration-75"
                      // The reason I do this with opacity is so that the horizontal spacing doesn't jump around a bunch
                      style={{ opacity: hover ? "5%" : "100%" }}
                      onClick={() => navigator.clipboard.writeText(accountKey)}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      {accountKey}
                    </span>
                    <span
                      className="absolute left-1/2 top-[-0.15rem] flex w-full -translate-x-1/2 justify-center text-blue-700 underline transition-opacity duration-75 dark:text-blue-200"
                      style={{ opacity: hover ? "100%" : "0%" }}
                      onClick={() => navigator.clipboard.writeText(accountKey)}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      Click To Copy
                    </span>
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
