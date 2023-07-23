/* eslint-disable @next/next/no-img-element */
import { useRef, useContext, useEffect } from "react";
import { DownloadButtonWithIcon, HighlightCarousel } from "../components";
import { DesktopHighlights } from "@components/Desktop/DesktopHighlights";
import Head from "next/head";
import { desktopModeContext } from "contexts";

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { desktopMode } = useContext(desktopModeContext);

  return (
    <>
      <Head>
        <title>DeckThemes</title>
      </Head>
      <div
        className="relative flex h-full w-full flex-col items-center gap-8 px-4 text-center"
        style={desktopMode ? { justifyContent: "center" } : {}}
        ref={contentRef}
      >
        <DesktopHighlights
          options={[
            {
              title: "Desktop",
              searchFilter: "DESKTOP-CSS",
              hrefLink: "/themes?type=DESKTOP-CSS",
              buttonText: "Desktop",
            },
          ]}
        />
      </div>

      <div
        className="relative flex h-full w-full flex-col items-center gap-8 px-4 text-center"
        style={desktopMode ? { justifyContent: "center" } : {}}
        ref={contentRef}
      >
        <DesktopHighlights
          options={[
            {
              title: "Big Picture Mode",
              searchFilter: "BPM-CSS",
              hrefLink: "/themes?type=BPM-CSS",
              buttonText: "BPM",
            },
          ]}
        />
      </div>
    </>
  );
}
