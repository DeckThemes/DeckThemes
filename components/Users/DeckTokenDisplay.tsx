import { useState } from "react";
import { fetchWithRefresh, genericGET } from "../../apiHelpers";
import { LoadingSpinner } from "../Generic";
import { RiRefreshLine } from "react-icons/ri";

export function DeckTokenDisplay({ userId }: { userId?: string | undefined }) {
  const [deckToken, setDeckToken] = useState<string | undefined>();
  const [hover, setHover] = useState<boolean>(false);
  function generateDeckToken() {
    setDeckToken("LOADING");
    fetchWithRefresh(() => {
      genericGET(`/users/${userId ? userId : "me"}/token`, true).then((json) => {
        if (json?.token) {
          setDeckToken(json.token);
        }
      });
    });
  }
  return (
    <div className="flex flex-col gap-4 p-4 border-borderLight dark:border-borderDark">
      <span className="text-xl font-semibold font-fancy">Connect Your Steam Deck</span>
      <div className="flex flex-col md:flex-row items-center">
        <button
          onClick={generateDeckToken}
          className="w-fit h-fit text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 hover:bg-base-3-dark select-none py-2 px-4 border border-borders-base3-dark rounded-full"
        >
          <RiRefreshLine />
          <div className="font-fancy text-xs font-bold">
            {deckToken ? "Reg" : "G"}enerate Deck Token
          </div>
        </button>
        {deckToken ? (
          <>
            <div className="px-4 py-4 md:py-0 relative">
              {deckToken === "LOADING" ? (
                <LoadingSpinner size={24} />
              ) : (
                <>
                  <div className="cursor-pointer underline">
                    <span
                      className="transition-opacity duration-75"
                      // The reason I do this with opacity is so that the horizontal spacing doesn't jump around a bunch
                      style={{ opacity: hover ? "5%" : "100%" }}
                      onClick={() => navigator.clipboard.writeText(deckToken)}
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      {deckToken}
                    </span>
                    <span
                      className="w-full flex justify-center underline absolute left-1/2 -translate-x-1/2 top-[-0.15rem] text-blue-700 dark:text-blue-200 transition-opacity duration-75"
                      style={{ opacity: hover ? "100%" : "0%" }}
                      onClick={() => navigator.clipboard.writeText(deckToken)}
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
