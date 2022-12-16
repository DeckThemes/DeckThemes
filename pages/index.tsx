import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { genericGET } from "../api";
import { CSSMiniThemeCard } from "../components";
import { ThemeQueryResponse } from "../types";
import { BsArrowDown } from "react-icons/bs";

export default function Home() {
  const [mostDownloadedThemes, setMostDownloaded] = useState<ThemeQueryResponse>();
  const [mostRecentThemes, setMostRecent] = useState<ThemeQueryResponse>();
  const [loaded, setLoaded] = useState<boolean>();

  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    async function getAndSetThemes() {
      // This just changes "All" to "", as that is what the backend looks for
      const mostDownloaded = await genericGET(
        `/themes?order=Most Downloaded&filter=CSS&perPage=7`,
        "Error Fetching Most Downloaded Themes!",
        true
      );
      if (mostDownloaded) {
        setMostDownloaded(mostDownloaded);
      }
      const mostRecent = await genericGET(
        `/themes?order=Last Updated&filter=CSS&perPage=7`,
        "Error Fetching Most Recent Themes!",
        true
      );
      if (mostRecent) {
        setMostRecent(mostRecent);
      }
      setLoaded(true);
    }
    getAndSetThemes();
  }, []);

  return (
    <>
      <main className="w-full flex flex-col items-center justify-center flex-grow gap-4">
        <div className="w-full h-screenMinusHeader flex items-center justify-center relative text-zinc-30">
          <div className="w-full h-full bg-black">
            <div
              style={{
                backgroundImage: `url(/hero_reel.gif)`,
                filter: "blur(8px) brightness(0.5)",
              }}
              className="w-full h-full bg-no-repeat bg-cover bg-center"
            />
          </div>
          <div className="absolute top-[40%]">
            <h1 className="font-extrabold text-4xl md:text-6xl">DeckThemes</h1>
            <h2 className="text-2xl md:text-3xl font-medium">CSSLoader & AudioLoader</h2>
          </div>
          <button
            className="absolute bottom-8"
            onClick={() => {
              contentRef?.current && contentRef.current.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <BsArrowDown size={60} />
          </button>
        </div>
        <div className="flex flex-col w-full items-center gap-8 pt-20" ref={contentRef}>
          <div className="flex flex-col w-10/12 items-center bg-cardLight dark:bg-cardDark rounded-3xl gap-4 pt-4 pb-8">
            <span className="text-3xl font-medium">Most Popular</span>
            <div className="flex flex-wrap w-full justify-center gap-4 px-4">
              {mostDownloadedThemes?.total ? (
                <>
                  {mostDownloadedThemes.items.map((e, i) => {
                    return <CSSMiniThemeCard data={e} key={`Most download ${i}`} />;
                  })}
                </>
              ) : null}
              <Link
                href="/themes?order=Most Downloaded"
                className="bg-borderLight dark:bg-borderDark hover:bg-darkBorderLight hover:dark:bg-darkBorderDark hover:translate-y-1 transition-all w-[260px] flex items-center justify-center rounded-3xl"
              >
                <span className="text-2xl p-4">View More</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col w-10/12 items-center bg-cardLight dark:bg-cardDark rounded-3xl gap-4 pt-4 pb-8">
            <span className="text-3xl font-medium">Recent Themes</span>
            <div className="flex flex-wrap w-full justify-center gap-4 px-4">
              {mostRecentThemes?.total ? (
                <>
                  {mostRecentThemes.items.map((e, i) => {
                    return <CSSMiniThemeCard data={e} key={`Most download ${i}`} />;
                  })}
                </>
              ) : null}
              <Link
                href="/themes?order=Last Updated"
                className="bg-borderLight dark:bg-borderDark hover:bg-darkBorderLight hover:dark:bg-darkBorderDark hover:translate-y-1 transition-all w-[260px] flex items-center justify-center rounded-3xl"
              >
                <span className="text-2xl p-4">View More</span>
              </Link>
            </div>
          </div>
          <Link href="/themes">
            <span className="text-3xl md:text-5xl font-semibold underline">View All Themes</span>
          </Link>
        </div>
      </main>
    </>
  );
}
