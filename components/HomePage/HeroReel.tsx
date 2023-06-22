import { ThemeQueryResponse } from "@customTypes/CSSThemeTypes";
import { genericGET } from "apiHelpers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export function HeroReel() {
  const [themeData, setThemeData] = useState<ThemeQueryResponse>({ total: 0, items: [] });
  const [loaded, setLoaded] = useState<boolean>(false);

  const firstCardRef = useRef();
  const rotations = ["rotate-2", "-rotate-2"];
  const numHeroCards = 4;

  // console.log(firstCardRef?.current?.);
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
        setLoaded(true);
        setThemeData(data);
      }
    });
  }, []);
  return (
    <>
      <div className="relative mt-16 h-96 max-w-[calc(100vw-48px)] overflow-hidden sm:mt-24 sm:h-96">
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
            animation: "hero-reel-scroll 30s infinite ease-in",
          }}
        >
          {loaded ? (
            <>
              {themeData.items.map((data, index) => (
                <Link
                  // ref={index === 0 ? firstCardRef : null}
                  href={`/themes/view?themeId=${data.id}`}
                  key={index}
                  className={`img-shadow group relative aspect-[16/10] w-[32rem] flex-none rounded-xl border-2 border-borders-base1-light bg-[#27272a] transition dark:border-borders-base1-dark dark:bg-zinc-800 sm:rounded-2xl ${getRandomRotationClass(
                    index
                  )}`}
                >
                  <span className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 scale-75 text-lg font-semibold opacity-0 transition-all group-hover:translate-y-10 group-hover:scale-100 group-hover:opacity-100">
                    {data.name}
                  </span>
                  <Image
                    className="z-0 overflow-hidden rounded-xl"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/blobs/${data.images[0]?.id}`}
                    alt={`Hero Image ${index + 1}`}
                    fill={true}
                  />
                </Link>
              ))}
              {themeData.items.map((data, index) => (
                <Link
                  href={`/themes/view?themeId=${data.id}`}
                  key={index}
                  className={`img-shadow group relative aspect-[16/10] w-[32rem] flex-none rounded-xl border-2 border-borders-base1-light bg-[#27272a] transition dark:border-borders-base1-dark dark:bg-zinc-800 sm:rounded-2xl ${getRandomRotationClass(
                    index
                  )}`}
                >
                  <span className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 scale-75 text-lg font-semibold opacity-0 transition-all group-hover:translate-y-10 group-hover:scale-100 group-hover:opacity-100">
                    {data.name}
                  </span>
                  <Image
                    className="z-0 overflow-hidden rounded-xl"
                    src={`${process.env.NEXT_PUBLIC_API_URL}/blobs/${data.images[0]?.id}`}
                    alt={`Hero Image ${index + 1}`}
                    fill={true}
                  />
                </Link>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
