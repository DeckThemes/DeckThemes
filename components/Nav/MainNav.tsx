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
import { Discord, Patreon } from "@icons-pack/react-simple-icons";
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
      <div className="ml-auto flex mx-4 h-full items-center">
        {!!process.env.NEXT_PUBLIC_DISCORD_URL && (
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="bg-[#5865F2] flex flex-col items-center justify-center h-full w-16 text-textLight dark:text-textDark hover:text-textFadedLight hover:dark:text-textFadedDark transition-colors"
          >
            <Discord size={31} />
            {/* <span className="text-sm">Chat</span> */}
          </a>
        )}
        {!!process.env.NEXT_PUBLIC_PATREON_URL && (
          <a
            href={process.env.NEXT_PUBLIC_PATREON_URL}
            target="_blank"
            rel="noreferrer"
            className="bg-[#FF424D] flex flex-col items-center justify-center h-full w-16 text-textLight dark:text-textDark hover:text-textFadedLight hover:dark:text-textFadedDark transition-colors"
          >
            <Patreon size={31} />
            {/* <span className="text-sm">Donate</span> */}
          </a>
        )}
      </div>
      <div className="mr-4 h-4/5 font-extrabold flex items-center">
        <a
          href={process.env.NEXT_PUBLIC_DOCS_URL}
          rel="noreferrer"
          target="_blank"
          className="mr-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
        >
          <ImBook size={28} />
        </a>
        {accountInfo?.username ? (
          <>
            {accountInfo.permissions.includes(Permissions.viewSubs) && (
              <Link
                href="/submissions"
                className="mr-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
              >
                <RiAdminFill size={32} />
              </Link>
            )}
            <Link
              href="/submit"
              className="hidden md:flex mr-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
            >
              <TbUpload size={32} className="scale-x-105" />
            </Link>
            {/* @ts-ignore */}
            <MiniPfpDisplay accountInfo={accountInfo} goToMe hideName />
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
