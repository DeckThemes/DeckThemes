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
    <nav className="flex w-full items-center justify-center">
      <div className="mx-4 flex w-full max-w-7xl items-center justify-between py-8">
        <div className="">
          {router.pathname === "/desktop" ? (
            <NavIcon disabled />
          ) : (
            <FiArrowLeft
              className="cursor-pointer"
              size={48}
              onClick={() => router.back()}
            />
          )}
        </div>
        <div className="ml-auto flex h-full items-center gap-8 font-extrabold md:ml-8">
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
                    <div
                      href="/tokenLogin"
                      className="ml-8 flex h-full items-center justify-center rounded-xl bg-brandBlue px-4 py-2 text-white"
                    >
                      <span>Login with Token</span>
                    </div>
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
