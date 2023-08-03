import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { authContext } from "contexts";
import { genericGET } from "../../apiHelpers";
import { AccountData, Permissions } from "../../types";
import {
  LoadingSpinner,
  PfpDisplay,
  ThemeCategoryDisplay,
  TransitionedCarouselTitle,
} from "../../components";
import Head from "next/head";
import { HorizontalRadio, RadioDropdown } from "@components/Primitives";

function BigDivider() {
  return (
    <div className="my-4 h-2 w-full bg-borderLight dark:bg-borderDark md:w-10/12 md:rounded-3xl" />
  );
}

export default function Account() {
  const router = useRouter();
  let { userId } = router.query;
  let parsedId: string = "";
  // this is here because for some reason @types/next thinks that router.query can be an array of strings
  if (Array.isArray(userId)) {
    parsedId = userId[0];
  } else {
    parsedId = userId || "";
  }

  const [loaded, setLoaded] = useState<boolean>(false);
  const { accountInfo } = useContext(authContext);
  const [userInfo, setUserInfo] = useState<AccountData | undefined>();

  const [radioValue, setRadioValue] = useState<string>("themes");

  useEffect(() => {
    if (parsedId) {
      genericGET(`/users/${parsedId}`).then((data) => {
        if (data) {
          setUserInfo(data);
        }
        setLoaded(true);
        return;
      });
    }
  }, [parsedId]);

  if (!loaded) {
    return (
      <>
        <Head>
          <title>DeckThemes | Loading</title>
        </Head>
        <main className="flex flex-grow items-center justify-center px-5 text-center">
          <LoadingSpinner />
          <h1 className="text-4xl font-semibold">Loading</h1>
        </main>
      </>
    );
  }

  if (!userInfo?.username) {
    return (
      <>
        <Head>
          <title>DeckThemes | Invalid User</title>
        </Head>
        <main className="flex flex-grow items-center justify-center px-5 text-center">
          <h1 className="pt-20 text-4xl font-semibold">Error! Invalid User ID</h1>
        </main>
      </>
    );
  }

  const calcDisplayName = () => {
    const slicedName = userInfo.username.includes("#")
      ? userInfo.username.slice(0, userInfo.username.lastIndexOf("#"))
      : userInfo.username;
    if (slicedName.slice(-1).toLowerCase() === "s") {
      return `${slicedName}'`;
    } else {
      return `${slicedName}'s`;
    }
  };
  const radioOptions = [
    {
      value: "themes",
      displayText: "Themes",
      title: `${calcDisplayName()} Themes`,
    },
    {
      value: "stars",
      displayText: "Stars",
      title: `${calcDisplayName()} Stars`,
    },
    {
      value: "submissions",
      displayText: "Submissions",
      title: `${calcDisplayName()} Submissions`,
    },
  ];

  return (
    <>
      <Head>
        <title>{userInfo.username} | DeckThemes</title>
      </Head>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <PfpDisplay userData={userInfo} />
        {/* If you're un-authed, this title will just always stay as "x's Themes" */}
        <TransitionedCarouselTitle
          className="px-4 pb-20"
          titles={radioOptions.map((e) => e.title)}
          currentTitle={
            radioOptions.find((e) => e.value === radioValue)?.title || radioOptions[0].title
          }
        />

        {accountInfo?.permissions.includes(Permissions.admin) && (
          <>
            <div className="block w-full px-4 md:hidden">
              <RadioDropdown
                ariaLabel="Your Theme Types Dropdown"
                options={radioOptions}
                value={radioValue}
                onValueChange={setRadioValue}
              />
            </div>
            <div className="hidden w-full items-center justify-center md:flex">
              <HorizontalRadio
                rootClass="self-center pb-4"
                options={radioOptions}
                value={radioValue}
                onValueChange={setRadioValue}
              />
            </div>
          </>
        )}
        <ThemeCategoryDisplay
          typeOptionPreset="All"
          themesPerPage={4}
          themeDataApiPath={`/users/${parsedId}/${radioValue}`}
          filterDataApiPath={`/users/${parsedId}/${radioValue}/filters`}
          noAuthRequired={radioValue === "themes"}
          useSubmissionCards={radioValue === "submissions"}
        />
      </div>
    </>
  );
}
