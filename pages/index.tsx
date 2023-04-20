import Link from "next/link";
import { useRef, ReactNode, useContext } from "react";
import { HighlightReelView } from "../components";
import { BsArrowDown } from "react-icons/bs";
import Head from "next/head";
import { desktopModeContext } from "./_app";

function ColorfulTitle({ children }: { children: ReactNode }) {
  return (
    <span className="font-fancy text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-tl from-blue-400 to-purple-500">
      {children}
    </span>
  );
}

export default function Home() {
  const contentRef = useRef<HTMLDivElement>(null);

  const { desktopMode } = useContext(desktopModeContext);

  return (
    <>
      <Head>
        <title>DeckThemes | Home</title>
      </Head>
      <main className="w-full flex flex-col items-center justify-center flex-grow gap-4">
        <div className="w-full h-screenMinusHeader flex items-center justify-center relative text-zinc-300">
          <div className="w-full h-full bg-black overflow-hidden">
            <div
              style={{
                backgroundImage: `url(/hero_reel.gif)`,
                filter: "blur(8px) brightness(0.5)",
              }}
              className="w-full h-full bg-no-repeat bg-cover bg-center"
            />
          </div>
          <div className="absolute top-[40%] items-center flex flex-col">
            <h1 className="font-extrabold text-4xl md:text-6xl">DeckThemes</h1>
            <h2 className="font-default text-2xl md:text-3xl font-medium">
              CSS Loader and Audio Loader
            </h2>
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
        <div
          className="flex flex-col w-full items-center gap-8 pt-10 text-center h-full relative xl:w-11/12 xl:flex-row xl:items-start"
          ref={contentRef}
        >
          <>
            <div className="w-10/12 flex flex-col gap-8 items-center">
              <Link href="/themes">
                <ColorfulTitle>CSS Loader</ColorfulTitle>
              </Link>
              <HighlightReelView
                apiURL="/themes?order=Most Downloaded&filters=CSS&perPage=6"
                linkHref="/themes?order=Most Downloaded"
                title="Popular CSS Themes"
              />
              <HighlightReelView
                apiURL="/themes?order=Last Updated&filters=CSS&perPage=6"
                linkHref="/themes?order=Last Updated"
                title="Recent CSS Themes"
              />
            </div>
            {!desktopMode && (
              <>
                <div className="w-10/12 flex flex-col gap-8 items-center">
                  <Link href="/packs">
                    <ColorfulTitle>Audio Loader</ColorfulTitle>
                  </Link>
                  <HighlightReelView
                    apiURL="/themes?order=Most Downloaded&filters=AUDIO&perPage=6"
                    linkHref="/packs?order=Most Downloaded"
                    title="Popular Audio Packs"
                  />
                  <HighlightReelView
                    apiURL="/themes?order=Last Updated&filters=AUDIO&perPage=6"
                    linkHref="/packs?order=Last Updated"
                    title="Recent Audio Packs"
                  />
                </div>
              </>
            )}
          </>
        </div>
      </main>
    </>
  );
}
