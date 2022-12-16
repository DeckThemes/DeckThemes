import Link from "next/link";
import { useContext } from "react";
import { themeContext } from "../../styles";
import Image from "next/image";

export function CSSIcon({}) {
  const { theme, setTheme } = useContext(themeContext);

  return (
    <Link href="/" className="flex items-center">
      <Image
        src={theme === "light" ? "/logo_css_lightmode.png" : "/logo_css_darkmode.png"}
        height="48"
        width="48"
        alt="CSSLoader Logo"
      />
      <span className="hidden md:flex font-semibold text-3xl pl-4">CSSLoader</span>
    </Link>
  );
}
