import Head from "next/head";
import { useEffect, useState } from "react";
import { ImSpinner5 } from "react-icons/im";
import { genericGET } from "../api";
import { CSSMiniThemeCard, LoadingSpinner } from "../components";
import { ThemeQueryResponse } from "../types";

export default function Home() {
  const [themeArr, setThemeArr] = useState<ThemeQueryResponse>({ total: 0, items: [] });
  const [loaded, setLoaded] = useState<boolean>(false);

  async function getThemes() {
    const themeData = await genericGET("/css_themes", "Error Fetching Themes!");
    if (themeData) {
      setThemeArr(themeData);
    }
    setLoaded(true);
  }

  useEffect(() => {
    getThemes();
  }, []);

  return (
    <>
      <Head>
        <title>CSSLoader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center">
        <h1 className="font-bold text-5xl md:text-6xl py-4 text-glow-lgDark">CSSLoader</h1>
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-semibold text-3xl text-glow-mdDark">Themes</h2>
          {themeArr.total > 0 ? (
            <div className="flex gap-4 flex-wrap items-center justify-center p-10">
              {themeArr.items.map((e) => {
                return <CSSMiniThemeCard data={e} key={`ThemeCard ${e.id}`} />;
              })}
            </div>
          ) : (
            <>
              {loaded ? (
                <span className="pt-10 text-xl text-red-500">No Themes Found</span>
              ) : (
                <div className="flex items-center text-4xl gap-2 pt-10">
                  <LoadingSpinner />
                  <span>Loading</span>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
