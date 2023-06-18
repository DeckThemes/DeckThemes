import Link from "next/link";
import { useRef, ReactNode, useContext } from "react";
import { HighlightCarousel } from "../components";
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
        <meta name="title" content="DeckThemes | Home" />
        <meta
          name="description"
          content="CSSLoader and AudioLoader themes for Steam Deck and Desktop Steam"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://deckthemes.com/" />
        <meta property="og:title" content="DeckThemes | Home" />
        <meta
          property="og:description"
          content="CSSLoader and AudioLoader themes for Steam Deck and Desktop Steam"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://deckthemes.com/" />
        <meta property="twitter:title" content="DeckThemes | Home" />
        <meta
          property="twitter:description"
          content="CSSLoader and AudioLoader themes for Steam Deck and Desktop Steam"
        />
      </Head>
      <main className="flex flex-1 flex-col items-center flex-grow gap-4 page-shadow border-[1px] dark:border-borders-base1-dark dark:bg-base-2-dark py-12 mx-4 rounded-3xl">
        {/* {!desktopMode && (
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
        )} */}
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
