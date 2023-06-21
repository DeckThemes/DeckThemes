import { useContext, useEffect, useState } from "react";
import { authContext } from "../_app";
import { clearCookie, genericFetch, genericGET } from "../../apiHelpers";
import {
  DeckTokenDisplay,
  LoadingPage,
  LogInPage,
  PfpDisplay,
  ThemeCategoryDisplay,
  TransitionedCarouselTitle,
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
  const radioOptions = [
    { value: "stars", displayText: "Stars", title: "Your Stars" },
    { value: "themes", displayText: "Themes", title: "Your Themes" },
    {
      value: "submissions",
      displayText: "Submissions",
      title: "Your Submissions",
    },
  ];

  useEffect(() => {
    genericGET(`/auth/me_full`).then((data) => {
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
    const isSure = confirm(
      "This will remove all signed in web browsers and Steam Decks"
    );
    if (isSure) {
      genericFetch("/users/me/logout_all", { method: "POST" }, true).then(
        (success) => {
          if (success) {
            setAccountInfo(undefined);
            clearCookie();
          }
        }
      );
    }
  }

  if (accountInfo?.username) {
    return (
      <>
        <Head>
          <title>DeckThemes | My Profile</title>
        </Head>
        <main className="font-fancy page-shadow mx-4 flex-1 flex-grow flex-col items-center gap-4 rounded-3xl border-[1px] border-borders-base1-light bg-base-2-light py-12 dark:border-borders-base1-dark dark:bg-base-2-dark">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
            <PfpDisplay userData={meInfo || accountInfo} />
            <TransitionedCarouselTitle
              className="pb-20"
              titles={radioOptions.map((e) => e.title)}
              currentTitle={
                radioOptions.find((e) => e.value === radioValue)?.title ||
                radioOptions[0].title
              }
            />
            <HorizontalRadio
              rootClass="self-center pb-4"
              options={radioOptions}
              value={radioValue}
              onValueChange={setRadioValue}
            />
            <ThemeCategoryDisplay
              typeOptionPreset="All"
              themesPerPage={4}
              useSubmissionCards={radioValue === "submissions"}
              themeDataApiPath={`/users/me/${radioValue}`}
              filterDataApiPath={`/users/me/${radioValue}/filters`}
            />
            <DeckTokenDisplay />
            <div className="flex flex-col gap-6 p-4">
              <span className="font-fancy text-xl font-semibold">Log Out</span>
              <button
                onClick={logOut}
                className="flex w-fit select-none items-center gap-2 rounded-full border border-borders-base3-dark bg-red-500 py-2 px-4 text-textLight transition duration-150 hover:scale-95 hover:bg-red-600 hover:text-bgDark hover:active:scale-90 dark:text-textDark dark:hover:text-bgLight"
              >
                <div className="font-fancy text-xs font-bold">Log out</div>
              </button>
              <button
                onClick={logOutAll}
                className="flex w-fit select-none items-center gap-2 rounded-full border border-red-500 py-2 px-4 text-textLight transition duration-150 hover:scale-95 hover:bg-red-600 hover:text-bgDark hover:active:scale-90 dark:text-textDark dark:hover:text-bgLight"
              >
                <div className="font-fancy text-xs font-bold">
                  Log out other devices
                </div>
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
