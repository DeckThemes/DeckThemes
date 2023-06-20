import Link from "next/link";
import { useTheme } from "next-themes";

import Image from "next/image";
import { useRouter } from "next/router";

export function NavIcon({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const src = () => {
    if (router.pathname.includes("/packs")) {
      // @ts-ignore
      return theme === "light"
        ? "/logo_audio_lightmode.png"
        : "/logo_audio_darkmode.png";
    }
    // @ts-ignore
    return theme === "light"
      ? "/logo_css_lightmode.png"
      : "/logo_css_darkmode.png";
  };
  return (
    <Link
      href={disabled ? "#" : "/"}
      className="group flex select-none items-center transition duration-150 hover:scale-95 hover:active:scale-90 "
    >
      <>
        <Image
          src={src()}
          height="24"
          width="24"
          alt="CSSLoader Logo"
          className="transition duration-[750ms] group-hover:brightness-150 group-hover:hue-rotate-180"
        />
        <span className="font-fancy hidden pl-4 text-xl font-semibold md:flex">
          DeckThemes
        </span>
      </>
    </Link>
  );
}
