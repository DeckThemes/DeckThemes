import { useState, useEffect } from "react";

export function useVW() {
  const [vw, setVW] = useState<number>(typeof window === "undefined" ? 0 : window.innerWidth);
  useEffect(() => {
    if (typeof window === "undefined") setVW(0);
    function handleResize() {
      setVW(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return vw;
}
