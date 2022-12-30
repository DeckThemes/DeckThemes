import { useContext, useState, useEffect } from "react";
import { authContext } from "../_app";
import { clearCookie, fetchDiscordUrl, fetchWithRefresh, genericGET } from "../../api";
import {
  DeckTokenDisplay,
  LoadingSpinner,
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
    const isSure = confirm("This will remove all signed in web browsers and Steam Deck");
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
            filterDataApiPath={`/users/${accountInfo?.id}/stars/filters`}
            title="Starred Themes"
            addPluginChoice
          />
          <BigDivider />
          <UserThemeCategoryDisplay
            themeDataApiPath="/users/me/themes"
            filterDataApiPath={`/users/${accountInfo?.id}/themes/filters`}
            title="Your Approved Themes"
            addPluginChoice
          />
          <BigDivider />
          <UserThemeCategoryDisplay
            themeDataApiPath="/users/me/submissions"
            filterDataApiPath={`/users/${accountInfo?.id}/submissions/filters`}
            title="Your Submissions"
            useSubmissionCards
            addPluginChoice
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
    return (
      <>
        <Head>
          <title>DeckThemes | Loading</title>
        </Head>
        <main className="flex w-full flex-grow items-center justify-center text-center px-5 gap-2">
          <LoadingSpinner />
          <span className="text-4xl font-semibold">Loading</span>
        </main>
      </>
    );
  }

  if (!accountInfo?.username) {
    return (
      <>
        <Head>
          <title>DeckThemes | Log In</title>
        </Head>
        <main className="flex flex-col items-center text-center px-5">
          <h1 className="text-4xl font-semibold pt-20">You Are Not Logged In</h1>
          <button
            className="text-discordColor font-medium text-5xl pt-10"
            onClick={fetchDiscordUrl}
          >
            <span>Login</span>
          </button>
        </main>
      </>
    );
  }
}
