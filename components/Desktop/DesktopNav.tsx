import { useContext } from "react";
import { authContext } from "../../pages/_app";

import { RiAdminFill } from "react-icons/ri";
import { Permissions } from "../../types";
import { MiniPfpDisplay } from "../Users";
import { LoadingSpinner } from "../Generic";
import { useHasCookie } from "../../hooks";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import { NavIcon, NavIconLink } from "../Nav";

export function DesktopNav() {
  const { accountInfo } = useContext(authContext);
  const hasCookie = useHasCookie();
  const router = useRouter();

  return (
    <nav className="w-full flex items-center justify-center">
      <div className="flex justify-between items-center max-w-7xl w-full py-8 mx-4">
        <div className="">
          {router.pathname === "/desktop" ? (
            <NavIcon disabled />
          ) : (
            <FiArrowLeft className="cursor-pointer" size={48} onClick={() => router.back()} />
          )}
        </div>
        <div className="font-extrabold flex items-center h-full ml-auto md:ml-8 gap-8">
          <>
            {accountInfo?.username ? (
              <>
                {accountInfo.permissions.includes(Permissions.viewSubs) && (
                  <NavIconLink href={"/submissions"} isInternal>
                    <RiAdminFill size={32} />
                  </NavIconLink>
                )}
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
                    <button className="bg-brandBlue text-white px-4 py-2 h-full rounded-xl ml-8 flex items-center justify-center">
                      <span>Login with Token</span>
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
