import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { authContext } from "../../pages/_app";
import { themeContext } from "../../styles";
import { fetchDiscordUrl } from "../../api";
import { NavIcon } from "./NavIcon";

import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { TbUpload } from "react-icons/tb";
import { RiAdminFill } from "react-icons/ri";
import { Permissions } from "../../types";
import { MiniPfpDisplay } from "../Users";
import { LoadingSpinner } from "../Generic";

export function MainNav() {
  // const router = useRouter();

  const [hasCookie, setHasCookie] = useState<boolean>(true);
  const { accountInfo } = useContext(authContext);
  const { theme, setTheme } = useContext(themeContext);

  useEffect(() => {
    const cookieStr = document.cookie;
    if (cookieStr) {
      const cookieObj = cookieStr
        .split(";")
        .map((v) => v.split("="))
        .reduce((acc: any, v) => {
          acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
          return acc;
        }, {});
      if (Object.keys(cookieObj).indexOf("authToken") >= 0) {
        console.log("hasCookie");
        setHasCookie(true);
        return;
      }
    }
    setHasCookie(false);
  }, []);

  return (
    <nav className="w-full bg-cardLight dark:bg-cardDark h-16 flex items-center">
      <div className="ml-4">
        <>
          <NavIcon />
        </>
      </div>
      <div className="ml-auto mr-4 h-4/5 font-extrabold flex items-center">
        {accountInfo?.username ? (
          <>
            {/* @ts-ignore */}
            <MiniPfpDisplay accountInfo={accountInfo} goToMe />
            {accountInfo.permissions.includes(Permissions.viewSubs) && (
              <Link
                href="/submissions"
                className="ml-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
              >
                <RiAdminFill size={34} />
              </Link>
            )}
            <Link
              href="/submit"
              className="ml-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
            >
              <TbUpload size={36} className="scale-x-105" />
            </Link>
            <div className="w-1 h-full bg-borderLight dark:bg-borderDark rounded-full ml-3" />
          </>
        ) : (
          <>
            {hasCookie ? (
              <>
                <LoadingSpinner />
              </>
            ) : (
              <>
                <button
                  className="bg-discordColor px-2 h-full rounded-md flex items-center justify-center text-slate-800"
                  onClick={fetchDiscordUrl}
                >
                  <span>
                    Login <br />
                    With Discord
                  </span>
                </button>
              </>
            )}
          </>
        )}
        <button
          className="pl-4 pr-1 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
          onClick={() => {
            if (theme === "light") {
              setTheme("dark");
              localStorage.theme = "dark";
              return;
            }
            setTheme("light");
            localStorage.theme = "light";
            return;
          }}
        >
          {theme === "light" ? <FaRegSun className="w-8 h-8" /> : <FaRegMoon className="w-8 h-8" />}
        </button>
      </div>
    </nav>
  );
}
