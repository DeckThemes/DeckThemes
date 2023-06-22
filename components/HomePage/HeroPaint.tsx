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
      <div className="relative w-full min-w-[calc(100vw-16px)] overflow-hidden h-full aspect-video rounded-2xl my-12">
		<div className="landing-gradients mx-4 relative md:scale-[0.95] sm:scale-[0.80] overflow-hidden h-full aspect-video dark:bg-base-3-dark rounded-2xl ring-[1px] ring-borders-base3-light dark:ring-borders-base1-dark">
		
		{/* experiment with mix-blend-mode glowy stuff and blur */}
		{/* <div
          className="absolute top-32 -left-10 z-20 h-full w-20 hidden md:block overflow-hidden blur-3xl backdrop-blur-2xl max-h-[860px]"
          style={{
            transform: `translate3d(${mousePos.x}px,0px,0px)`,
          }}
        ></div> */}

		{/* could clean up the brush stroke or use a css-based transitioner ^ */}
		<div
          className="absolute -top-1 left-0 z-20 aspect-video w-full hidden md:block overflow-hidden "
          style={{
            backgroundImage: "url('/roller.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transform: `translate3d(${mousePos.x / 1.1 - 1024}px,${mousePos.y / 2 * 0.4 - 40}px,0px) rotateZ(${
              (mousePercent - 20) * 0.2 - 24
            }deg)`,
          }}
        ></div>

        <div
          className="absolute top-0 left-0 right-0 bottom-0 md:-top-4 z-10 w-full overflow-hidden"
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
          className="absolute left-0 right-0 bottom-0  top-0 md:-top-4 z-0 w-full overflow-hidden"
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
