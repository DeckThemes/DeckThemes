import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { authContext } from "../_app";
import { clearCookie, fetchDiscordUrl, genericGET } from "../../api";
import {
  FilterQueryResponse,
  ThemeQueryRequest,
  ThemeQueryResponse,
  ThemeSubmissionQueryResponse,
} from "../../types";
import {
  MiniSubmissionCard,
  FilterSelectorCard,
  LoadingSpinner,
  MiniThemeCardRoot,
  PageSelector,
  PfpDisplay,
  UserThemeCategoryDisplay,
} from "../../components";
import { generateParamStr } from "../../api";
import Head from "next/head";
import Link from "next/link";

function BigDivider() {
  return (
    <div className="h-2 bg-borderLight dark:bg-borderDark w-full my-4 md:w-10/12 md:rounded-3xl" />
  );
}

export default function Account() {
  const { accountInfo, setAccountInfo } = useContext(authContext);
  const [loaded, setLoaded] = useState(true);

  const [hasCookie, setHasCookie] = useState<boolean>(true);
  useEffect(() => {
    const cookieStr = document.cookie;
    if (cookieStr) {
      const cookieObj = cookieStr
        .split(";")
        .map((v) => v.split("="))
        .reduce((acc: any, v) => {
          acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
          return acc;
        }, {});
      if (Object.keys(cookieObj).indexOf("authToken") >= 0) {
        setHasCookie(true);
        return;
      }
    }
    setHasCookie(false);
  }, [accountInfo]);

  function logOut() {
    setAccountInfo(undefined);
    clearCookie();
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
          />
          <BigDivider />
          <UserThemeCategoryDisplay
            themeDataApiPath="/users/me/themes"
            filterDataApiPath={`/users/${accountInfo?.id}/themes/filters`}
            title="Your Approved Themes"
          />
          <BigDivider />
          <UserThemeCategoryDisplay
            themeDataApiPath="/users/me/submissions"
            filterDataApiPath={`/users/${accountInfo?.id}/submissions/filters`}
            title="Your Submissions"
            useSubmissionCards
          />
          <div className="mt-5" />
          <button
            onClick={logOut}
            className="mt-auto p-5 mb-5 font-medium text-xl bg-cardLight dark:bg-cardDark rounded-full"
          >
            Log Out
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
