/* eslint-disable @next/next/no-img-element */
import { useRef, ReactNode, useContext } from "react";
import { DownloadButtonWithIcon, HighlightCarousel } from "../components";
import Head from "next/head";
import { desktopModeContext } from "./_app";

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);

  const { desktopMode } = useContext(desktopModeContext);

  return (
    <>
      <Head>
        <title>DeckThemes</title>
        <meta name="title" content="DeckThemes" />
        <meta
          name="description"
          content="CSSLoader and AudioLoader themes for Steam Deck and Desktop Steam"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deckthemes.com/" />
        <meta property="og:title" content="DeckThemes" />
        <meta
          property="og:description"
          content="CSSLoader and AudioLoader themes for Steam Deck and Desktop Steam"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://deckthemes.com/" />
        <meta property="twitter:title" content="DeckThemes" />
        <meta
          property="twitter:description"
          content="CSSLoader and AudioLoader themes for Steam Deck and Desktop Steam"
        />
      </Head>
      <main className="flex flex-1 flex-col items-center flex-grow gap-4 page-shadow border-[1px] border-borders-base1-light bg-base-2-light dark:border-borders-base1-dark dark:bg-base-2-dark py-12 mx-4 rounded-3xl">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-center">
            Take Steam
            <br />
            to the next
            <br />
            <span className="bg-gradient-to-tr from-cssPurple to-brandBlue bg-clip-text text-transparent text-6xl">
              Level
            </span>
          </h1>
          <div
            style={{ backgroundImage: `url(/hero.png)` }}
            className="w-11/12 h-[30vh] sm:h-[50vh] lg:h-[70vh] bg-contain bg-no-repeat bg-center"
          />
          <h3 className="text-3xl font-semibold pb-2">Install</h3>
          <div className="flex gap-4">
            <DownloadButtonWithIcon iconName="steamdeck" />
            <DownloadButtonWithIcon iconName="windows11" />
          </div>
        </div>
        <div
          className="flex flex-col w-full items-center gap-8 text-center h-full relative px-4"
          style={desktopMode ? { justifyContent: "center" } : {}}
          ref={contentRef}
        >
          <HighlightCarousel
            options={[
              {
                title: "Desktop CSS Themes",
                searchFilter: "DESKTOP-CSS",
                hrefLink: "/themes?type=DESKTOP-CSS",
              },
              {
                title: "BPM CSS Themes",
                searchFilter: "BPM-CSS",
                hrefLink: "/themes?type=BPM-CSS",
              },
              // This has a trailing ? because the link filler only knows to add "&order="
              { title: "AudioLoader Packs", searchFilter: "AUDIO", hrefLink: "/packs?" },
            ]}
          />
        </div>
      </main>
    </>
  );
}
