import { PartialCSSThemeInfo, ThemeQueryResponse } from "@customTypes/CSSThemeTypes";
import { genericGET } from "apiHelpers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const cssCardBlurDataUrl: string =
  "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABAQEBAREBIUFBIZGxgbGSUiHx8iJTgoKygrKDhVNT41NT41VUtbSkVKW0uHal5eaoecg3yDnL2pqb3u4u7///8BEBAQEBEQEhQUEhkbGBsZJSIfHyIlOCgrKCsoOFU1PjU1PjVVS1tKRUpbS4dqXl5qh5yDfIOcvampve7i7v/////AABEIAF8AjgMBIgACEQEDEQH/xABjAAADAQEBAQAAAAAAAAAAAAACAwQBBQAGEAEAAwEBAQEBAAAAAAAAAAAAAQISAxMRFGEBAAMBAQEAAAAAAAAAAAAAAAABAgMEBREBAQEBAQEBAAAAAAAAAAAAAAECERIhMf/aAAwDAQACEQMRAD8A+MyzKjLJq6PCOpsvfD8hyPA6V8eybluR4HSstydFRxRNyE+BYVRzHHNNgRxzF5ro5GeLDWuNJHM8wzR1J4lTyGddFjnYbhZ5vRzaJiXDcLI5N80XTWYDFXpoorVs1enxz8RzQGVk1BkuKmU2W5UZeyVVMExU2tRxUyIZ0rnjIqZFBQbVjqIerQ2OYqnR8cm5et8ETzKnku+QGYgYPbnzye8l01hmYbX8Rn9RxzZPNX8gFnPa68z4ih6S9Mmz2PTkkFIQzLPqbpckG0vTdM7pfwbfpentF1ls+JNiyPQ4umuddWx0Xc6Og/VjrLXNdDbNoPUM9SmT1p0PSAz0QeoZ6qsTm/V09Cpuk9QT0YXLrzv4KIbk2lFEcnb6c3UOQzV0vEq3JN0fpD8e+KJ5hwi6Hor4GVGAzUvRX6nZoVoKkekcHpuyWfTB22bJ+tgFaZp77LIgeTLofshmTMhmqeKm3Y5QvpSHO5XdDn0hdKU7EEdKQo3BF7wzqklqF5NtaC9Jqnsl2qbou1kKSXhNMKekp5k4mg+MmBslXUFfB1hg6qiNHUqfFAUUwuMbSZoTaqySLHwSl06/FVe7jego6yXXTx3P0f0Fu7j+0vT2lNN0p7A9XO9WeqTdP1DPVzvVk9C4fVVrlTZPN2bHCqnT02Tbe2OJ4f8ARVsl02LnCsdGtzo6OZFzPRcqLh0J6E2ul9ATc+lMP//Z";

export function HeroReel() {
  const [themeData, setThemeData] = useState<ThemeQueryResponse>({ total: 0, items: [] });
  const [loaded, setLoaded] = useState<boolean>(false);

  const rotations = ["rotate-2", "-rotate-2"];
  const numHeroCards = 5;

  const randomSeed = useMemo(
    () =>
      Array(numHeroCards)
        .fill("")
        .map(() => Math.random()),
    [numHeroCards]
  );

  const getRandomRotationClass = (index: number) => {
    const randomIndex = Math.floor(randomSeed[index % numHeroCards] * rotations.length);
    return rotations[randomIndex];
  };

  useEffect(() => {
    genericGET(`/themes?filters=CSS&order=Last Updated&perPage=${numHeroCards}`).then((data) => {
      if (data) {
        console.log(data);
        setLoaded(true);
        setThemeData(data);
      }
    });
  }, []);
  function ReelCard({ data, index }: { data: PartialCSSThemeInfo; index: number }) {
    const imageSrc = useMemo(() => {
      if (!loaded) return cssCardBlurDataUrl;
      if (data.images.length > 0) {
        return `${process.env.NEXT_PUBLIC_API_URL}/blobs/${data.images[0].id}/thumb?maxWidth=600`;
      }
      return `https://share.deckthemes.com/${data?.type.toLowerCase()}placeholder.png`;
    }, [data, loaded]);

    return (
      <Link
        // ref={index === 0 ? firstCardRef : null}
        href={loaded ? `/themes/view?themeId=${data.id}` : "#"}
        key={index}
        className={`img-shadow group relative aspect-[16/10] w-[24rem] flex-none rounded-xl border-2 border-borders-base1-light bg-[#27272a] transition dark:border-borders-base1-dark dark:bg-zinc-800 sm:rounded-2xl md:w-[32rem] ${getRandomRotationClass(
          index
        )}`}
      >
        <span className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 scale-75 text-center text-lg font-semibold opacity-0 transition-all group-hover:translate-y-10 group-hover:scale-100 group-hover:opacity-100">
          {loaded ? data.displayName : ""}
        </span>
        <div className="absolute aspect-[16/10] w-[24rem] overflow-hidden rounded-xl md:w-[32rem]">
          <Image
            priority={index <= 2}
            placeholder="blur"
            blurDataURL={cssCardBlurDataUrl}
            className="z-0 rounded-xl"
            src={imageSrc}
            alt={loaded ? data.name : `Hero Image ${index}`}
            style={{ objectFit: "cover", filter: loaded ? "" : "blur(50px)" }}
            fill={true}
          />
        </div>
      </Link>
    );
  }
  return (
    <>
      <div className="relative mt-0 flex h-[24rem] max-w-[calc(100vw-48px)] items-center overflow-hidden md:mt-12 md:h-[30rem]">
        <style>
          {`
          @keyframes hero-reel-scroll {
            0% {
              transform: translateX(0px);
            }
            100% {
              transform: translateX(-${490.177 * numHeroCards + 20 * numHeroCards}px);
            }
          }
          `}
        </style>
        <div
          className="img-section flex justify-start gap-5 overflow-visible py-4 px-4 sm:gap-8"
          style={{
            animation: "hero-reel-scroll 55s infinite linear",
          }}
        >
          {Array(numHeroCards)
            .fill("")
            .map((_, index) => {
              const data = themeData?.items?.[index];
              return (
                <>
                  <ReelCard {...{ data, index, loaded }} />
                </>
              );
            })}
          {Array(numHeroCards)
            .fill("")
            .map((_, index) => {
              const data = themeData?.items?.[index];
              return (
                <>
                  <ReelCard {...{ data, index, loaded }} />
                </>
              );
            })}
        </div>
      </div>
    </>
  );
}
