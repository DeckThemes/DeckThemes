import { useContext } from "react";
import { authContext } from "../_app";
import { clearCookie, fetchDiscordUrl } from "../../api";
import {
  DeckTokenDisplay,
  LoadingPage,
  LogInPage,
  PfpDisplay,
  UserThemeCategoryDisplay,
} from "../../components";
import Head from "next/head";
import { useHasCookie } from "../../hooks";

function BigDivider() {
  return (
    <div className="h-2 bg-borderLight dark:bg-borderDark w-full my-4 md:w-10/12 md:rounded-3xl" />
  );
}

export default function Account() {
  const { accountInfo, setAccountInfo } = useContext(authContext);

  const hasCookie = useHasCookie();

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
        <main className="flex flex-col items-center w-full">
          <PfpDisplay
            avatar={accountInfo.avatar}
            username={accountInfo.username}
            id={accountInfo.id}
          />
          <div className="mt-4" />
          <UserThemeCategoryDisplay
            themeDataApiPath="/users/me/stars"
            filterDataApiPath={`/users/me/stars/filters`}
            title="Starred Themes"
            addPluginChoice
          />
          <BigDivider />
          <UserThemeCategoryDisplay
            themeDataApiPath="/users/me/themes"
            filterDataApiPath={`/users/me/themes/filters`}
            title="Your Approved Themes"
            addPluginChoice
          />
          <BigDivider />
          <UserThemeCategoryDisplay
            themeDataApiPath="/users/me/submissions"
            filterDataApiPath={`/users/me/submissions/filters`}
            title="Your Submissions"
            useSubmissionCards
            addPluginChoice
            showFiltersWithZero
            defaultFilter="AwaitingApproval"
          />
          <BigDivider />
          <DeckTokenDisplay />
          <div className="mt-5" />
          <button
            onClick={logOut}
            className="mt-auto p-5 mb-5 font-medium text-xl bg-cardLight dark:bg-cardDark rounded-full"
          >
            Log Out
          </button>
          <button
            onClick={logOutAll}
            className="mt-auto p-5 mb-5 font-medium text-xl bg-cardLight dark:bg-cardDark rounded-full"
          >
            Log Out All Devices
          </button>
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
