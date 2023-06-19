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
    <nav className="font-fancy w-full flex items-center justify-center">
      <div className="flex items-center max-w-7xl w-full py-4 mx-4">
        <div className="">
          <NavIcon />
        </div>
        <div className="md:ml-auto flex ml-8 h-full items-center gap-8">
          <>
            {!!process.env.NEXT_PUBLIC_DISCORD_URL && (
              <NavIconLink href={process.env.NEXT_PUBLIC_DISCORD_URL} className="flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 select-none py-4">
                <Discord size={18} />
				<div className="font-fancy text-xs font-bold hidden sm:flex ">Discord</div>
              </NavIconLink>
            )}
            {!!process.env.NEXT_PUBLIC_PATREON_URL && (
              <NavIconLink href={process.env.NEXT_PUBLIC_PATREON_URL} className="flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 select-none py-4">
                <Patreon size={14} />
				<div className="font-fancy text-xs font-bold hidden sm:flex">Patreon</div>
              </NavIconLink>
            )}
          </>
        </div>
        <div className="font-extrabold flex items-center h-full ml-auto md:ml-8 gap-8">
          <NavIconLink href={process.env.NEXT_PUBLIC_DOCS_URL || "/"} className="flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 select-none py-4">
            <ImBook size={14} />
			<div className="font-fancy text-xs font-bold hidden sm:flex ">Documentation</div>
          </NavIconLink>
          <>
            {accountInfo?.username ? (
              <>
                {accountInfo.permissions.includes(Permissions.viewSubs) && (
                  <NavIconLink href={"/submissions"} className="flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 select-none py-4" isInternal>
                    <RiAdminFill size={14} />
					<div className="font-fancy text-xs font-bold hidden sm:flex ">Admin <span className="opacity-50">(???)</span></div>
                  </NavIconLink>
                )}
                <NavIconLink href={"/submit"} className="flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 hover:bg-base-3-dark select-none py-2 px-4  border border-borders-base3-dark rounded-full" isInternal>
                  <TbUpload size={14} className="scale-x-105" />
				  <div className="font-fancy text-xs font-bold hidden sm:block">Upload</div>
                </NavIconLink>
                @ts-ignore
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
                      className="border border-borders-base3-dark rounded-full text-xs px-4 py-2 h-full justify-center text-white flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 select-none hover:bg-base-3-dark"
                      onClick={fetchDiscordUrl}
                    >
                      <div>Login <span className="hidden sm:inline-block">with Discord</span></div>
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
