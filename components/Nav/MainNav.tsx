import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { authContext, desktopModeContext } from "../../pages/_app";
import { fetchDiscordUrl } from "../../apiHelpers";
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
  const { desktopMode } = useContext(desktopModeContext);
  const hasCookie = useHasCookie();

  return (
    <nav
      className="w-full bg-cardLight dark:bg-cardDark h-16 flex items-center"
      style={
        desktopMode
          ? {
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: "10",
              backgroundColor: "transparent",
            }
          : {}
      }
    >
      <div className="ml-4">
        <NavIcon />
      </div>
      <div
        style={
          desktopMode
            ? {
                gap: "1rem",
              }
            : {}
        }
        className="md:ml-auto flex mx-4 h-full items-center gap-4 md:gap-0"
      >
        {!!process.env.NEXT_PUBLIC_DISCORD_URL && (
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            style={
              desktopMode
                ? {
                    borderRadius: "100%",
                    height: "3rem",
                    width: "3rem",
                  }
                : {}
            }
            className="md:bg-discordColor text-discordColor h-full w-4 md:w-16 md:text-textLight md:dark:text-textDark"
          >
            <div className="w-full h-full md:hover:bg-cardLight md:dark:hover:bg-cardDark transition-colors flex flex-col items-center justify-center">
              <Discord
                size={31}
                style={
                  desktopMode
                    ? {
                        transform: "translateX(1px)",
                      }
                    : {}
                }
              />
            </div>
          </a>
        )}
        {!!process.env.NEXT_PUBLIC_PATREON_URL && (
          <a
            href={process.env.NEXT_PUBLIC_PATREON_URL}
            target="_blank"
            rel="noreferrer"
            style={
              desktopMode
                ? {
                    borderRadius: "100%",
                    height: "3rem",
                    width: "3rem",
                  }
                : {}
            }
            className="md:bg-patreonColor text-patreonColor flex flex-col items-center justify-center h-full w-8 md:w-16 md:text-textLight md:dark:text-textDark transition-colors"
          >
            <div className="w-full h-full md:hover:bg-cardLight md:dark:hover:bg-cardDark transition-colors flex flex-col items-center justify-center">
              <Patreon
                size={31}
                style={
                  desktopMode
                    ? {
                        transform: "translateX(1px)",
                      }
                    : {}
                }
              />
            </div>
          </a>
        )}
      </div>
      <div className="ml-auto md:ml-0 mr-4 h-4/5 font-extrabold flex items-center">
        {!desktopMode && (
          <a
            href={process.env.NEXT_PUBLIC_DOCS_URL}
            rel="noreferrer"
            target="_blank"
            className="mr-2 text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight"
          >
            <ImBook size={28} />
          </a>
        )}
        {!desktopMode && (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}
