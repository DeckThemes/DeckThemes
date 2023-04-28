import Link from "next/link";
import { useContext } from "react";
import { themeContext } from "../../styles";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiHome } from "react-icons/fi";
import { desktopModeContext } from "../../pages/_app";

export function NavIcon({}) {
  const router = useRouter();
  const { desktopMode } = useContext(desktopModeContext);
  const { theme } = useContext(themeContext);
  const src = () => {
    if (router.pathname.includes("/packs")) {
      return theme === "light" ? "/logo_audio_lightmode.png" : "/logo_audio_darkmode.png";
    }
    return theme === "light" ? "/logo_css_lightmode.png" : "/logo_css_darkmode.png";
  };
  return (
    <Link href="/" className="flex items-center">
      {desktopMode ? (
        <FiHome size={48} />
      ) : (
        <Image
          // src={theme === "light" ? "/logo_css_lightmode.png" : "/logo_css_darkmode.png"}
          src={src()}
          height="48"
          width="48"
          alt="CSSLoader Logo"
        />
      )}

      <span className="font-fancy hidden md:flex font-semibold text-3xl pl-4">DeckThemes</span>
    </Link>
  );
}
