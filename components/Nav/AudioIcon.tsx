import Link from "next/link";
import { useContext } from "react";
import { themeContext } from "../../styles";
import Image from "next/image";

import darkImg from "../../public/logo_audio_darkmode.png";
import lightImg from "../../public/logo_audio_lightmode.png";

export function AudioIcon({}) {
  const { theme, setTheme } = useContext(themeContext);

  return (
    <Link href="/">
      <Image
        src={theme === "light" ? lightImg : darkImg}
        height="48"
        width="48"
        alt="CSSLoader Logo"
      />
    </Link>
  );
}
