import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { genericGET, getPaginatedThemes } from "../api";
import { CSSMiniThemeCard } from "../components";
import { ThemeQueryResponse } from "../types";

export default function Home() {
  const [themeArr, setThemeArr] = useState<ThemeQueryResponse>({ total: 0, items: [] });

  async function getThemes() {
    const themeData = await genericGET("/css_themes", "Error Fetching Themes!");
    setThemeArr(themeData);
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
        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-3xl text-glow-mdDark">Themes</h2>
          {themeArr !== undefined &&
            themeArr.items.map((e) => {
              return <CSSMiniThemeCard data={e} key={`ThemeCard ${e.id}`} />;
            })}
        </div>
      </main>
    </>
  );
}
