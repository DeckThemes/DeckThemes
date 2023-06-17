import { useEffect, useState } from "react";
import { ThemeQueryResponse } from "../../types";
import { genericGET } from "../../apiHelpers";
import { LoadingSpinner } from "../Generic";
import { LoadingSkeletonCard, MiniThemeCardRoot, ViewMoreCard } from "../Themes";
import { useVW } from "../../hooks";

export function HighlightCardView({
  apiURL,
  viewMoreURL,
}: {
  apiURL: string;
  viewMoreURL: string;
}) {
  const [themeData, setData] = useState<ThemeQueryResponse>();
  const [loaded, setLoaded] = useState<boolean>(false);
  const vw = useVW();
  useEffect(() => {
    setLoaded(false);
    genericGET(apiURL).then((data) => {
      if (data) {
        setData(data);
      }
      setLoaded(true);
    });
  }, [apiURL]);
  return (
    <div>
      <div className="flex justify-center items-center w-full">
        <div
          className={`flex flex-wrap w-full justify-center gap-4 ${!loaded ? "items-center" : ""}`}
        >
          {loaded ? (
            <>
              {themeData?.total ? (
                <>
                  {themeData.items
                    .filter((_, i) => {
                      if (vw >= 1188 && vw < 1488) {
                        return i <= 2;
                      }
                      if (vw >= 1488 && vw < 1790) {
                        return i <= 3;
                      }
                      return true;
                    })
                    .map((e, i) => {
                      return <MiniThemeCardRoot data={e} key={`Most download ${i}`} />;
                    })}
                  <ViewMoreCard href={viewMoreURL} />
                </>
              ) : null}
            </>
          ) : (
            Array(6)
              .fill("")
              .map((_, i) => <LoadingSkeletonCard key={`Loading_Card_${i}`} />)
          )}
        </div>
      </div>
    </div>
  );
}
