import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { authContext } from "../../pages/_app";
import { fetchDiscordUrl } from "../../api";
import { NavIcon } from "./NavIcon";

import { TbUpload } from "react-icons/tb";
import { RiAdminFill } from "react-icons/ri";
import { Permissions } from "../../types";
import { MiniPfpDisplay } from "../Users";
import { LoadingSpinner } from "../Generic";
import { Discord } from "@icons-pack/react-simple-icons";
import { useHasCookie } from "../../hooks";
import { ImBook } from "react-icons/im";

export function MainNav() {
  // const router = useRouter();
  const { accountInfo } = useContext(authContext);

  const hasCookie = useHasCookie();

  return (
    <nav className="w-full bg-cardLight dark:bg-cardDark h-16 flex items-center">
      <div className="ml-4">
        <NavIcon />
      </div>
      <div>
        <a
          href="https://discord.gg/HsU72Kfnpf"
          target="_blank"
          rel="noreferrer"
          className="ml-4 px-2 flex items-center gap-2 md:bg-bgLight md:dark:bg-bgDark p-1 rounded-2xl"
        >
          <Discord size={36} />
          <span className="hidden md:flex">Join The Discord!</span>
        </a>
      </div>
      <div className="ml-auto mr-4 h-4/5 font-extrabold flex items-center">
        {accountInfo?.username ? (
          <>
            {accountInfo.permissions.includes(Permissions.viewSubs) && (
              <Link
                href="/submissions"
                className="mr-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
              >
                <RiAdminFill size={34} />
              </Link>
            )}
            <Link
              href="/submit"
              className="hidden md:flex mr-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
            >
              <TbUpload size={36} className="scale-x-105" />
            </Link>
            <a
              href="https://docs.deckthemes.com"
              rel="noreferrer"
              target="_blank"
              className="mr-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
            >
              <ImBook size={34} />
            </a>
            {/* @ts-ignore */}
            <MiniPfpDisplay accountInfo={accountInfo} goToMe />
          </>
        ) : (
          <>
            {hasCookie ? (
              <>
                <LoadingSpinner size={32} />
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
      </div>
    </nav>
  );
}
