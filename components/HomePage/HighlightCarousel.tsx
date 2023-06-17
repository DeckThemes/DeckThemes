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
        target.style.transform = `translate(0, -50%)`;
        target.onanimationend = null;
        target.style.animation = null;
        resolve();
      };
      target.onanimationend = animationEnded;
      target.style.transform = `translate(-50px, -50%)`;
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
        <div className="border-b-2 relative border-black dark:border-white w-full flex justify-between items-center h-16">
          {/* This is some cursed ass code but it lets me transition the titles so that the "header" section doesn't have to move with the rest of the carousel */}
          {options.map((e, i) => {
            return (
              <h2
                ref={titleRefArr[i]}
                key={`Carousel_Title_${i}`}
                style={{
                  transform: "translateY(-50%)",
                  transitionDuration: `${animationDuration}`,
                }}
                className={`text-3xl font-semibold absolute left-0 top-1/2 transition-transform ${
                  i === 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                {e.title}
              </h2>
            );
          })}
          <div className="ml-auto">
            <OrderValueToggle
              {...{ orderValue, setOrderValue }}
              orderOptions={["Popular", "Recent"]}
            />
          </div>
        </div>
        <div>
          <HighlightCardView
            apiURL={`/themes?filters=${options[currentNumber].searchFilter}${orderUrl}`}
            viewMoreURL={`${options[currentNumber].hrefLink + orderUrl}`}
          />
        </div>
        <div className="flex self-center gap-4">
          {options.map((_, i) => {
            return (
              <button
                disabled={i === currentNumber || transitioning}
                onClick={() => i !== currentNumber && handleCarouselShift(i)}
                key={`Carousel_Dot_${i}`}
                className={`w-4 h-4 ${
                  i === currentNumber
                    ? `bg-borderLight dark:bg-borderDark`
                    : `bg-elevation-2-light dark:bg-elevation-2-dark hover:bg-elevation-3-light dark:hover:bg-elevation-3-dark`
                } rounded-full transition-colors duration-500`}
              ></button>
            );
          })}
        </div>
      </div>
    </>
  );
}
