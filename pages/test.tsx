import { useEffect, useState } from "react";

export default function Test() {
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
  return (
    <>
      <div className="relative w-full">
        <div
          className="absolute top-0 left-0 z-20 h-[800px] w-64 "
          style={{
            backgroundImage: "url('/roller2.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            transform: `translate3d(${mousePos.x - 100}px,${mousePos.y / 20}px,0px) rotateZ(${
              (mousePercent - 50) * 0.2 + 90
            }deg)`,
          }}
        ></div>
        <div
          className="absolute top-0 left-0 z-10 h-[800px] w-full overflow-hidden"
          style={{
            transform: `translate3d(${mousePos.x}px,0px,0px)`,
          }}
        >
          <div
            className="h-[800px] w-full"
            style={{
              transform: `translate3d(-${mousePos.x}px,0px,0px)`,

              backgroundImage: "url('/before.png')",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
        <div
          className="absolute left-0 top-0 z-0 h-[800px] w-full overflow-hidden"
          style={{
            transform: `translate3d(-${window.innerWidth - mousePos.x}px,0px,0px)`,
          }}
        >
          <div
            className="h-[800px] w-full"
            style={{
              transform: `translate3d(${window.innerWidth - mousePos.x}px,0px,0px)`,

              backgroundImage: "url('/after.png')",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
