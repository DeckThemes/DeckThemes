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
      <main className="py-32 flex flex-1 flex-grow flex-col items-center gap-4 bg-base-2-light dark:bg-base-2-dark">
        <div
          className="relative flex h-full w-full flex-col items-center gap-8 px-4 text-center"
          style={desktopMode ? { justifyContent: "center" } : {}}
          ref={contentRef}
        >
          <HighlightCarousel
            options={[
              {
                title: "Desktop Themes",
                searchFilter: "DESKTOP-CSS",
                hrefLink: "/themes?type=DESKTOP-CSS",
                buttonText: "Desktop",
              },
              {
                title: "BPM Themes",
                searchFilter: "BPM-CSS",
                hrefLink: "/themes?type=BPM-CSS",
                buttonText: "BPM",
              },
            ]}
          />
        </div>
      </main>
    </>
  );
}
