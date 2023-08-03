import { useEffect, useState } from "react";
import { ThemeQueryResponse } from "../../types";
import { genericGET } from "../../apiHelpers";
import {
  LoadingSkeletonCard,
  MiniThemeCardRoot,
  ViewMoreCard,
} from "../Themes";
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
      <div className="flex w-full items-center justify-center">
        <div
          className={`grid w-full grid-cols-1 justify-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
            !loaded ? "items-center" : ""
          }`}
        >
          {loaded ? (
            <>
              {themeData?.total ? (
                <>
                  {themeData.items.map((e, i) => {
                    return (
                      <MiniThemeCardRoot
                        data={e}
                        key={`Most download ${i}`}
                        className={i >= 5 ? "hidden lg:inline" : "inline"}
                      />
                    );
                  })}
                  <ViewMoreCard href={viewMoreURL} />
                </>
              ) : null}
            </>
          ) : (
            Array(8)
              .fill("")
              .map((_, i) => (
                <LoadingSkeletonCard
                  key={`Loading_Card_${i}`}
                  className={i >= 6 ? "hidden lg:inline" : "inline"}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
