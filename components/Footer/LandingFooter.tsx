import { useContext } from "react";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { themeContext } from "../../styles";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Discord, Patreon } from "@icons-pack/react-simple-icons";
import { NavIconLink } from "@components/Nav";

export function LandingFooter() {
  const router = useRouter();
  const { theme } = useContext(themeContext);
  const src = () => {
    if (router.pathname.includes("/packs")) {
      return theme === "light" ? "/logo_audio_lightmode.png" : "/logo_audio_darkmode.png";
    }
    return theme === "light" ? "/logo_css_lightmode.png" : "/logo_css_darkmode.png";
  };
  return (
    <footer className="w-full h-fit flex flex-col mt-auto">
      <div className="w-full max-w-7xl mx-auto my-16">
        <div className="flex flex-col lg:flex-row justify-between gap-20 px-8">
          {/* logo section */}
          <div className="flex flex-col items-start gap-6">
            <Link
              href={"/"}
              className="flex items-center select-none group hover:scale-95 transition duration-150 hover:active:scale-90 "
            >
              <>
                <Image
                  src={src()}
                  height="24"
                  width="24"
                  alt="CSSLoader Logo"
                  className="group-hover:hue-rotate-180 group-hover:brightness-150 duration-1000 transition"
                />
                <span className="font-fancy hidden md:flex font-semibold text-xl pl-4">
                  DeckThemes
                </span>
              </>
            </Link>
            <p className="font-fancy text-sm text-fore-10-dark">
              DeckThemes is the largest repository of custom themes, styles, and audio packs for
              Steam.
            </p>
			<p className="font-fancy text-sm text-fore-5-dark max-w-2xl">
				Decky Loader, CSS Loader, and Audio Loader are not affiliated with Valve Corporation.
				Steam, the Steam logo, Steam Deck, and the Steam Deck logo are trademarks and/or
				registered trademarks of Valve Corporation in the U.S. and/or other countries.
            </p>
          </div>

          <div className="flex flex-row gap-32">
            <div className="flex flex-col">
              <span className="text-brandBlue">Socials</span>
              <ul className="flex flex-col w-max my-4 gap-4">
                <li className="list-none">
                  {!!process.env.NEXT_PUBLIC_DISCORD_URL && (
                    <NavIconLink
                      href={process.env.NEXT_PUBLIC_DISCORD_URL}
                      className="flex items-center gap-2"
                    >
                      <div className="">Discord</div>
                    </NavIconLink>
                  )}
                </li>
                <li>
                  {!!process.env.NEXT_PUBLIC_PATREON_URL && (
                    <NavIconLink
                      href={process.env.NEXT_PUBLIC_PATREON_URL}
                      className="flex items-center gap-2"
                    >
                      <div className="">Patreon</div>
                    </NavIconLink>
                  )}
                </li>
              </ul>
            </div>

            <div className="flex flex-col">
              <span className="text-brandBlue">Policies</span>
              <ul className="flex flex-col w-max my-4 gap-4">
                <li className="list-none">
                  <Link href="/tos" className="">
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
			
          </div>
        </div>
        <div className=""></div>
      </div>
    </footer>
  );
}
