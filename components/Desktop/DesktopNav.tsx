import { useContext } from "react";
import { authContext } from "contexts";

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
    <>
      <nav className="absolute flex w-full items-center justify-center px-4">
        <div className="flex w-full max-w-7xl items-center justify-between pb-4 pt-4">
          <div className="">
            {router.pathname === "/desktop" ? (
              <></>
            ) : (
              <FiArrowLeft className="cursor-pointer" size={24} onClick={() => router.back()} />
            )}
          </div>
          <div className="ml-auto flex h-full items-center gap-8 font-extrabold md:ml-8">
            <>
              {accountInfo?.username ? (
                <>
                  {accountInfo.permissions.includes(Permissions.viewSubs) && (
                    <NavIconLink ariaLabel="View Submissions" href={"/submissions"} isInternal>
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
                      <button
                        onClick={() => {
                          window.parent.postMessage(
                            {
                              action: "tokenRedirect",
                            },
                            "*"
                          );
                        }}
                        className="ml-8 flex h-full items-center justify-center rounded-xl bg-base-3-light px-4 py-2 text-white dark:bg-base-3-dark"
                      >
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
      <div className="h-[72px] w-full" aria-hidden></div>
    </>
  );
}
