import { useState } from "react";
import { fetchWithRefresh, genericGET } from "../../api";
import { LoadingSpinner } from "../Generic";

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
    <>
      <span className="text-3xl font-semibold pb-2">Connect Your Steam Deck</span>
      <div className="flex flex-col md:flex-row items-center bg-cardLight dark:bg-cardDark rounded-3xl">
        <button
          onClick={generateDeckToken}
          className="w-full p-4 bg-borderLight dark:bg-borderDark rounded-3xl font-semibold"
        >
          {deckToken ? "Reg" : "G"}enerate Deck Token
        </button>
        {deckToken ? (
          <>
            <div className="px-4 py-4 md:py-0 relative">
              {deckToken === "LOADING" ? (
                <LoadingSpinner />
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
                      className="underline text-xl absolute left-1/2 -translate-x-1/2 top-[-0.15rem] text-blue-700 dark:text-blue-200 transition-opacity duration-75"
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
    </>
  );
}
