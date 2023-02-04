import Link from "next/link";
import { useEffect, useState } from "react";
import { genericGET } from "../../api";
import { ThemeQueryResponse } from "../../types";
import { LoadingSpinner } from "../Generic";
import { MiniThemeCardRoot } from "../Themes";

export function HighlightReelView({
  apiURL,
  title = "Themes",
  linkHref = "/",
}: {
  apiURL: string;
  title: string;
  linkHref: string;
}) {
  const [themeData, setData] = useState<ThemeQueryResponse>();
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    genericGET(apiURL).then((data) => {
      if (data) {
        setData(data);
      }
      setLoaded(true);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col w-full items-center rounded-3xl bg-elevation-1-light dark:bg-elevation-1-dark gap-4 py-8 px-2 md:px-4">
        <div className="flex justify-between items-center w-full px-2 gap-2">
          <h3 className="text-2xl md:text-3xl font-medium text-start">{title}</h3>
          <Link
            href={linkHref}
            className="bg-elevation-2-light dark:bg-elevation-2-dark hover:bg-elevation-3-light hover:dark:bg-elevation-3-dark transition-colors p-2 px-4 rounded-3xl text-xl md:text-2xl"
          >
            View More
          </Link>
        </div>
        <div className="flex justify-center items-center w-full">
          <div
            className={`flex flex-wrap w-full justify-center gap-4 ${
              !loaded ? "items-center" : ""
            }`}
          >
            {loaded ? (
              <>
                {themeData?.total ? (
                  <>
                    {themeData.items.map((e, i) => {
                      return <MiniThemeCardRoot data={e} key={`Most download ${i}`} />;
                    })}
                  </>
                ) : null}
              </>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
