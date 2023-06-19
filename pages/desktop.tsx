/* eslint-disable @next/next/no-img-element */
import { useRef, useContext, useEffect } from "react";
import { DownloadButtonWithIcon, HighlightCarousel } from "../components";
import Head from "next/head";
import { desktopModeContext } from "./_app";

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { desktopMode, setDesktopMode } = useContext(desktopModeContext);

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
      <main className="flex flex-1 flex-col items-center flex-grow gap-4 bg-base-2-light dark:bg-base-2-dark py-12 rounded-3xl">
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
