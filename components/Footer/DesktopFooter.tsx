import { FaRegMoon, FaRegSun } from "react-icons/fa";
import Link from "next/link";
import { NavIcon, NavIconLink } from "@components/Nav";
import { useTheme } from "next-themes";
import { PatreonFooterBar } from "./PatreonFooterBar";

export function DesktopFooter() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <footer className="mt-auto flex h-fit w-full flex-col">
      <div className="mx-auto my-16 w-full max-w-7xl">
        <div className="flex flex-col justify-between gap-20 px-8 lg:flex-row">
          <div className="flex flex-row gap-32">
            <div className="flex flex-col items-start">
              <ul className="my-4 flex w-max flex-col gap-4">
                <li className="list-none">
                  <Link href="/tos" className="">
                    Store Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <PatreonFooterBar />
      </div>
    </footer>
  );
}
