import { useContext, useEffect, useState } from "react";
import { authContext } from "../_app";
import { clearCookie, genericGET } from "../../apiHelpers";
import {
  DeckTokenDisplay,
  LoadingPage,
  LogInPage,
  PfpDisplay,
  ThemeCategoryDisplay,
} from "../../components";
import Head from "next/head";
import { useHasCookie } from "../../hooks";
import { UserInfo } from "../../types";

function BigDivider() {
  return (
    <div className="h-2 bg-borderLight dark:bg-borderDark w-full my-4 md:w-10/12 md:rounded-3xl" />
  );
}

export default function Account() {
  const { accountInfo, setAccountInfo } = useContext(authContext);

  const hasCookie = useHasCookie();

  const [meInfo, setMeInfo] = useState<UserInfo>();

  useEffect(() => {
    genericGET(`/auth/me_full`, true).then((data) => {
      if (data) {
        setMeInfo(data);
      }
      return;
    });
  }, []);

  function logOut() {
    setAccountInfo(undefined);
    clearCookie();
  }

  function logOutAll() {
    const isSure = confirm("This will remove all signed in web browsers and Steam Decks");
    if (isSure) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/logout_all`, {
        method: "POST",
        credentials: "include",
      }).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setAccountInfo(undefined);
          clearCookie();
        }
      });
    }
  }

  if (accountInfo?.username) {
    return (
      <>
        <Head>
          <title>DeckThemes | My Profile</title>
        </Head>
        <main className="flex-1 flex-col items-center flex-grow gap-4 page-shadow border-[1px] border-borders-base1-light bg-base-2-light dark:border-borders-base1-dark dark:bg-base-2-dark py-12 mx-4 rounded-3xl">
          <PfpDisplay userData={meInfo || accountInfo} />
          <div className="mt-4" />
          <ThemeCategoryDisplay
            typeOptionPreset="All"
            themeDataApiPath="/users/me/stars"
            filterDataApiPath={`/users/me/stars/filters`}
            title="Starred Themes"
          />
          <BigDivider />
          <ThemeCategoryDisplay
            typeOptionPreset="All"
            themeDataApiPath="/users/me/themes"
            filterDataApiPath={`/users/me/themes/filters`}
            title="Your Approved Themes"
          />
          <BigDivider />
          <ThemeCategoryDisplay
            typeOptionPreset="All"
            themeDataApiPath="/users/me/submissions"
            filterDataApiPath={`/users/me/submissions/filters`}
            title="Your Submissions"
            useSubmissionCards
            showFiltersWithZero
            defaultFilter="AwaitingApproval"
          />
          <BigDivider />
          <DeckTokenDisplay />
          <div className="my-5 h-2 w-10/12 rounded-full bg-borderLight dark:bg-borderDark" />
          <div className="flex gap-4 p-4">
            <button
              onClick={logOut}
              className="mt-auto p-5 mb-5 font-medium text-xl bg-red-500 rounded-3xl"
            >
              Log Out This Device
            </button>
            <button
              onClick={logOutAll}
              className="mt-auto p-5 mb-5 font-medium text-xl border-red-500 border-2 rounded-3xl"
            >
              Log Out All Devices
            </button>
          </div>
        </main>
      </>
    );
  }
  if (hasCookie) {
    return <LoadingPage />;
  }

  if (!accountInfo?.username) {
    return <LogInPage />;
  }
}
