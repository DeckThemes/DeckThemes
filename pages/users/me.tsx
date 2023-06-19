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
import { HorizontalRadio } from "@components/Primitives/HorizontalRadio";

export default function Account() {
  const { accountInfo, setAccountInfo } = useContext(authContext);

  const hasCookie = useHasCookie();

  const [meInfo, setMeInfo] = useState<UserInfo>();

  const [radioValue, setRadioValue] = useState<string>("stars");

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
        <main className="font-fancy flex-1 flex-col items-center flex-grow gap-4 page-shadow border-[1px] border-borders-base1-light bg-base-2-light dark:border-borders-base1-dark dark:bg-base-2-dark py-12 mx-4 rounded-3xl">
          <div className="flex flex-col max-w-7xl w-full mx-auto gap-8">
            <PfpDisplay userData={meInfo || accountInfo} />

            <div className="mt-4" />
            <HorizontalRadio
              options={[
                { value: "stars", displayText: "Starred" },
                { value: "themes", displayText: "Themes" },
                { value: "submissions", displayText: "Submissions" },
              ]}
              value={radioValue}
              onValueChange={setRadioValue}
            />
            <ThemeCategoryDisplay
              typeOptionPreset="All"
              useSubmissionCards={radioValue === "submissions"}
              themeDataApiPath={`/users/me/${radioValue}`}
              filterDataApiPath={`/users/me/${radioValue}/filters`}
            />

            <DeckTokenDisplay />

            <div className="flex flex-col gap-6 p-4">
              <span className="text-xl font-semibold font-fancy">Log Out</span>
              <button
                onClick={logOut}
                className="w-fit text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 bg-red-500 hover:bg-red-600 select-none py-2 px-4 border border-borders-base3-dark rounded-full"
              >
                <div className="font-fancy text-xs font-bold">Log out</div>
              </button>
              <button
                onClick={logOutAll}
                className="w-fit text-textLight hover:text-bgDark dark:text-textDark dark:hover:text-bgLight flex items-center gap-2 hover:scale-95 transition duration-150 hover:active:scale-90 border-red-500 hover:bg-red-600 select-none py-2 px-4 border rounded-full"
              >
                <div className="font-fancy text-xs font-bold">Log out other devices</div>
              </button>
            </div>
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
