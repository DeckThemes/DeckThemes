import { Dispatch, SetStateAction, createRef, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function TransitionedCarouselTitle({
  setTransitioning,
  titles,
  currentTitle,
  animationDuration = 200,
  className = "",
}: {
  // setTransitioning is for if you want to lock down functionality until transition is done
  setTransitioning?: Dispatch<SetStateAction<boolean>>;
  titles: string[];
  currentTitle: string;
  animationDuration?: number;
  className?: string;
}) {
  const [oldTitle, setOldTitle] = useState<string>(titles[0]);
  // This gives each title a ref so that it can be animated later
  // NOTE TO SELF: IF YOU EVER GET "target is null" errors, MEMOIZE YOUR TITLES OBJECT
  const [titleRefArr, setTitleRefArr] = useState<any[]>([]);
  useEffect(() => {
    const titleRefArr = titles.map(() => createRef());
    console.log("titleRefArr", titleRefArr);
    setTitleRefArr(titleRefArr);
    // I have no idea why but this errors if this is not stringified here
  }, [JSON.stringify(titles)]);

  useEffect(() => {
    if (currentTitle !== oldTitle) {
      transitionTitle(currentTitle);
    }
  }, [currentTitle]);

  async function transitionTitle(newTitle: string) {
    setTransitioning && setTransitioning(true);
    // This happens before the transition to account for the time it will take for the API call anyway
    setOldTitle(newTitle);
    console.log(titleRefArr);
    const oldIndex = titles.indexOf(oldTitle || titles[0]);
    const newIndex = titles.indexOf(newTitle || titles[0]);
    await fadeOut(titleRefArr[oldIndex].current);
    await fadeIn(titleRefArr[newIndex].current);
    setTransitioning && setTransitioning(false);
  }
  // These are only for the transitions on the title h2
  function fadeOut(target: any) {
    return new Promise<void>((resolve) => {
      const animationEnded = () => {
        target.style.opacity = 0;
        target.style.transform = `translateX(0)`;
        target.onanimationend = null;
        target.style.animation = null;
        resolve();
      };
      target.onanimationend = animationEnded;
      target.style.transform = `translateX(-50px)`;
      target.style.animation = `fade-out ${animationDuration}ms 1`;
    });
  }
  function fadeIn(target: any) {
    return new Promise<void>((resolve) => {
      const animationEnded = () => {
        target.style.opacity = 1;
        target.onanimationend = null;
        target.style.animation = null;
        resolve();
      };
      target.onanimationend = animationEnded;
      target.style.animation = `fade-in ${animationDuration}ms 1`;
    });
  }
  if (titleRefArr.length === 0) return null;
  return (
    <>
      <div className={twMerge("relative flex w-full flex-col", className)}>
        {titles.map((e, i) => {
          return (
            // Rewrote this to be a container div as that way I wouldn't need to touch translateY, makes my life easier
            <div
              ref={titleRefArr[i]}
              key={`Carousel_Title_${i}`}
              style={{
                transitionDuration: `${animationDuration}`,
              }}
              className={`absolute flex items-center text-3xl font-extrabold transition-transform ${
                i === 0 ? "opacity-100" : "opacity-0"
              }`}
            >
              <h2 className="text-3xl md:text-5xl">{e}</h2>
            </div>
          );
        })}
      </div>
    </>
  );
}
