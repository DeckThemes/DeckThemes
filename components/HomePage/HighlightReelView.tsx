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
    genericGET(apiURL, `Error Fetching Data at ${apiURL}`).then((data) => {
      if (data) {
        setData(data);
      }
      setLoaded(true);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col w-full items-center bg-cardLight dark:bg-cardDark rounded-3xl gap-4 pt-4 pb-8">
        <span className="text-2xl md:text-3xl font-medium">{title}</span>
        <div
          // TODO: 'items-center' COULD BREAK SOMETHING, PLEASE DOUBLE CHECK IT\
          className={`flex flex-wrap w-full justify-center gap-4 px-4 ${
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

          <Link
            href={linkHref}
            className="bg-borderLight dark:bg-borderDark hover:bg-darkBorderLight hover:dark:bg-darkBorderDark hover:translate-y-1 transition-all w-[260px] flex items-center justify-center rounded-3xl"
          >
            <span className="text-2xl p-4">View More</span>
          </Link>
        </div>
      </div>
    </>
  );
}
