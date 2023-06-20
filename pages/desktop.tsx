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
      </Head>
      <main className="flex flex-1 flex-grow flex-col items-center gap-4 rounded-3xl bg-base-2-light py-12 dark:bg-base-2-dark">
        <div
          className="relative flex h-full w-full flex-col items-center gap-8 px-4 text-center"
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
              {
                title: "AudioLoader Packs",
                searchFilter: "AUDIO",
                hrefLink: "/packs?",
              },
            ]}
          />
        </div>
      </main>
    </>
  );
}
