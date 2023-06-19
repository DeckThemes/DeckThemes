import { useContext } from "react";
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
import { NavIconLink } from "./NavIconLink";
import { DesktopNav } from "../Desktop";

export function MainNav() {
  const { accountInfo } = useContext(authContext);
  const { desktopMode } = useContext(desktopModeContext);
  const hasCookie = useHasCookie();

  if (desktopMode) return <DesktopNav />;

  return (
    <nav className="w-full flex items-center justify-center">
      <div className="flex items-center max-w-7xl w-full py-8 mx-4">
        <div className="">
          <NavIcon />
        </div>
        <div className="md:ml-auto flex ml-4 h-full items-center gap-8">
          <>
            {!!process.env.NEXT_PUBLIC_DISCORD_URL && (
              <NavIconLink href={process.env.NEXT_PUBLIC_DISCORD_URL}>
                <Discord size={28} />
              </NavIconLink>
            )}
            {!!process.env.NEXT_PUBLIC_PATREON_URL && (
              <NavIconLink href={process.env.NEXT_PUBLIC_PATREON_URL}>
                <Patreon size={28} />
              </NavIconLink>
            )}
          </>
        </div>
        <div className="font-extrabold flex items-center h-full ml-auto md:ml-8 gap-8">
          <NavIconLink href={process.env.NEXT_PUBLIC_DOCS_URL || "/"} className="hidden sm:flex">
            <ImBook size={28} />
          </NavIconLink>
          <>
            {accountInfo?.username ? (
              <>
                {accountInfo.permissions.includes(Permissions.viewSubs) && (
                  <NavIconLink href={"/submissions"} isInternal>
                    <RiAdminFill size={32} />
                  </NavIconLink>
                )}
                <NavIconLink href={"/submit"} isInternal>
                  <TbUpload size={32} className="scale-x-105" />
                </NavIconLink>
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
                      className="bg-discordColor px-4 py-2 h-full rounded-xl ml-8 flex items-center justify-center text-slate-800"
                      onClick={fetchDiscordUrl}
                    >
                      <span>Login with Discord</span>
                    </button>
                  </>
                )}
              </>
            )}
          </>
        </div>
      </div>
    </nav>
  );
}
