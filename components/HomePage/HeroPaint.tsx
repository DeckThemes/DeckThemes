import { useEffect, useState } from "react";

export default function HeroPaint() {
  const [mousePos, setMousePos] = useState<any>({});
  const [mousePercent, setMousePercent] = useState<number>(0);

  console.log(mousePercent);
  useEffect(() => {
    const handleMouseMove = (event: any) => {
      setMousePos({ x: event.clientX, y: event.clientY });
      const mousePercent = Math.trunc((event.clientX / window.innerWidth) * 100);
      setMousePercent(mousePercent);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // TODO: add a calculated maximum value to the transforms to ensure that the images don't continue to shift
  // for now, i just monkeypatched it with transform:scale and subtracted 16px transform from each half to mitigate this. it will only shift if you hover over the scrollbar.
  return (
    <>
      {/* calc'ed width accounts for scrollbar and prevents overflow */}
      <div className="relative my-12 mr-8 aspect-video h-full w-full min-w-[calc(100vw-16px)] overflow-hidden rounded-2xl">
        <div className="landing-gradients relative mx-4 aspect-video  h-full scale-[0.75] overflow-hidden rounded-2xl ring-[1px] ring-borders-base3-light dark:bg-base-3-dark dark:ring-borders-base1-dark sm:scale-[0.80] md:scale-[0.95]">
          {/* experiment with mix-blend-mode glowy stuff and blur */}
          {/* <div
          className="absolute top-32 -left-10 z-20 h-full w-20 hidden md:block overflow-hidden blur-3xl backdrop-blur-2xl max-h-[860px]"
          style={{
            transform: `translate3d(${mousePos.x}px,0px,0px)`,
          }}
        ></div> */}

          {/* could clean up the brush stroke or use a css-based transitioner ^ */}
          <div
            className="absolute -top-1 left-0 z-30 hidden aspect-video w-full overflow-hidden md:block "
            style={{
              backgroundImage: "url('/roller.png')",
              backgroundSize: "20%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              transform: `translate3d(${
                mousePos.x / 1.1 - window.innerWidth / 2 + mousePercent * (window.innerWidth / 960)
              }px,${(mousePos.y / 2) * 0.4 - 40}px,0px) rotateZ(${
                (mousePercent - 20) * 0.2 + 88
              }deg)`,
            }}
          ></div>
          <div
            className="absolute -top-1 left-0 z-20 hidden aspect-video w-full overflow-hidden md:block "
            style={{
              backgroundImage: "url('/brush.png')",
              backgroundSize: "20%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              transform: `translate3d(${
                mousePos.x / 1.1 - window.innerWidth / 2 + mousePercent * (window.innerWidth / 960)
              }px,${(mousePos.y / 2) * 0.4 - 40}px,0px) rotateZ(${
                (mousePercent - 20) * 0.02 + 5
              }deg)`,
            }}
          ></div>

          <div
            className="absolute top-0 left-0 right-0 bottom-0 z-10 w-full overflow-hidden md:-top-4"
            style={{
              transform: `translate3d(${mousePos.x}px,0px,0px)`,
            }}
          >
            <div
              className="aspect-video h-full w-full overflow-hidden"
              style={{
                transform: `translate3d(-${mousePos.x}px,0px,0px)`,

                backgroundImage: "url('/before.png')",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
          <div
            className="absolute left-0 right-0 bottom-0  top-0 z-0 w-full overflow-hidden md:-top-4"
            style={{
              transform: `translate3d(-${window.innerWidth - mousePos.x - 16}px,0px,0px)`,
            }}
          >
            <div
              className="aspect-video h-full w-full overflow-hidden"
              style={{
                transform: `translate3d(${window.innerWidth - mousePos.x - 16}px,0px,0px)`,

                backgroundImage: "url('/after.png')",
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
