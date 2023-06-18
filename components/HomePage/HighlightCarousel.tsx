import { createRef, useEffect, useMemo, useState } from "react";
import { OrderValueToggle } from "./OrderValueToggle";
import { HighlightCardView } from "./HighlightCardView";

const animationDuration = 200;

export function HighlightCarousel({
  options,
}: {
  options: {
    title: string;
    searchFilter: string;
    hrefLink: string;
  }[];
}) {
  const [orderValue, setOrderValue] = useState<string>("Popular");
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const orderUrl = useMemo(
    () => `&order=${orderValue === "Popular" ? "Most Downloaded" : "Last Updated"}`,
    [orderValue]
  );
  // This gives each title a ref so that it can be animated later
  const [titleRefArr, setTitleRefArr] = useState<any[]>([]);
  useEffect(() => {
    setTitleRefArr(options.map(() => createRef()));
  }, [options]);

  async function handleCarouselShift(newNumber: number) {
    setTransitioning(true);
    // This happens before the transition to account for the time it will take for the API call anyway
    setCurrentNumber(newNumber);
    await fadeOut(titleRefArr[currentNumber].current);
    await fadeIn(titleRefArr[newNumber].current);
    setTransitioning(false);
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

  return (
    <>
      <div className="flex flex-col w-full gap-4">
        <div className="border-b-2 relative border-black dark:border-white w-full flex flex-col sm:flex-row items-center h-28 sm:h-16">
          {/* This is some cursed ass code but it lets me transition the titles so that the "header" section doesn't have to move with the rest of the carousel */}
          {options.map((e, i) => {
            return (
              // Rewrote this to be a container div as that way I wouldn't need to touch translateY, makes my life easier
              <div
                ref={titleRefArr[i]}
                key={`Carousel_Title_${i}`}
                style={{
                  transitionDuration: `${animationDuration}`,
                }}
                className={`text-3xl font-semibold flex items-center h-16 absolute sm:left-0 transition-transform ${
                  i === 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                <h2>{e.title}</h2>
              </div>
            );
          })}
          <div className="mt-auto sm:mt-0 sm:ml-auto pb-4 sm:pb-0">
            <OrderValueToggle
              {...{ orderValue, setOrderValue }}
              orderOptions={["Popular", "Recent"]}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-col w-full gap-4">
          <div>
            <HighlightCardView
              apiURL={`/themes?perPage=5&filters=${options[currentNumber].searchFilter}${orderUrl}`}
              viewMoreURL={`${options[currentNumber].hrefLink + orderUrl}`}
            />
          </div>
          <div className="flex flex-col sm:flex-row self-center gap-4">
            {options.map((e, i) => {
              return (
                <button
                  disabled={i === currentNumber || transitioning}
                  onClick={() => i !== currentNumber && handleCarouselShift(i)}
                  key={`Carousel_Dot_${i}`}
                  className={`w-32 h-8 ${
                    i === currentNumber
                      ? `bg-borderLight dark:bg-borderDark`
                      : `bg-elevation-2-light dark:bg-elevation-2-dark hover:bg-elevation-3-light dark:hover:bg-elevation-3-dark`
                  } rounded-full transition-colors duration-500 font-fancy`}
                >
                  <span>{e.title.slice(0, e.title.indexOf(" "))}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
