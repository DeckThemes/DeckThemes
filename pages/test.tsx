import { useEffect, useState } from "react";

export default function Test() {
  const [mousePos, setMousePos] = useState({});
  const [mousePercent, setMousePercent] = useState<number>(0);
  console.log(mousePercent);
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
      setMousePercent(Math.trunc((event.clientX / window.innerWidth) * 100));
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  console.log(100 * (mousePercent / 100) + "%");
  return (
    <>
      <div className="relative w-full">
        <div
          className="absolute top-0 left-0 z-10 h-[800px] w-full"
          style={{
            backgroundImage: "url('/before.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            maskImage: "url('/test.png')",
            maskMode: "luminance",
            maskPosition: 100 - 100 * (mousePercent / 100) + "%",
            maskSize: "200%",
          }}
        ></div>
        <div
          className="absolute top-0 left-0 z-0 h-[800px] w-full "
          style={{
            backgroundImage: "url('/after.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div
          className="absolute top-0 z-20 h-[800px] w-[500px]"
          style={{
            left: 100 * (mousePercent / 100) - 10 + "%",
            backgroundImage: "url('/brush.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </>
  );
}
