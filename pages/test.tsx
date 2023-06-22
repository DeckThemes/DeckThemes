import { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

export default function Test() {
  const [mousePos, setMousePos] = useState({});
  const [mousePercent, setMousePercent] = useState<number>(0);
  const [brushSpring, brushApi] = useSpring(() => ({
    from: { x: (window.innerWidth - 200) / 2 },
  }));
  const [maskSpring, maskApi] = useSpring(() => ({
    from: { maskPosition: "50%", WebkitMaskPosition: "50%" },
  }));

  console.log(mousePercent);
  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePos({ x: event.clientX, y: event.clientY });
      const mousePercent = Math.trunc((event.clientX / window.innerWidth) * 100);
      setMousePercent(mousePercent);
      brushApi.start({ from: { x: brushSpring.x }, to: { x: event.clientX - 200 } });

      maskApi.start({
        from: {
          maskPosition: maskSpring.maskPosition,
          WebkitMaskPosition: maskSpring.WebkitMaskPosition,
        },
        to: {
          maskPosition: 100 - 100 * (mousePercent / 100) + "%",
          WebkitMaskPosition: 100 - 100 * (mousePercent / 100) + "%",
        },
      });
    };
    brushApi.start({ from: { x: brushSpring.x }, to: { x: window.innerWidth - 200 }, delay: 300 });
    maskApi.start({
      from: {
        maskPosition: maskSpring.maskPosition,
        WebkitMaskPosition: maskSpring.WebkitMaskPosition,
      },
      to: {
        maskPosition: 0 + "%",
        WebkitMaskPosition: 0 + "%",
      },
      delay: 300,
    });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  console.log(100 * (mousePercent / 100) + "%");
  return (
    <>
      <div className="relative w-full">
        <animated.div
          className="absolute top-0 left-0 z-10 h-[800px] w-full"
          style={{
            backgroundImage: "url('/before.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            WebkitMaskImage: "url('/test.png')",
            WebkitMaskSize: "200%",
            maskImage: "url('/test.png')",
            // maskPosition: 100 - 100 * (mousePercent / 100) + "%",
            maskSize: "200%",
            ...maskSpring,
          }}
        ></animated.div>
        <div
          className="absolute top-0 left-0 z-0 h-[800px] w-full "
          style={{
            backgroundImage: "url('/after.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <animated.div
          className="absolute top-0 z-20 h-[800px] w-[500px]"
          style={{
            // left: 100 * (mousePercent / 100) - 10 + "%",
            backgroundImage: "url('/brush.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            ...brushSpring,
          }}
        ></animated.div>
      </div>
    </>
  );
}
