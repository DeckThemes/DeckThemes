import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { authContext } from "../_app";
import { genericGET } from "../../apiHelpers";
import { AccountData, Permissions } from "../../types";
import { LoadingSpinner, PfpDisplay, ThemeCategoryDisplay } from "../../components";
import Head from "next/head";

function BigDivider() {
  return (
    <div className="h-2 bg-borderLight dark:bg-borderDark w-full my-4 md:w-10/12 md:rounded-3xl" />
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

  useEffect(() => {
    if (parsedId) {
      genericGET(`/users/${parsedId}`, true).then((data) => {
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
        <main className="flex justify-center flex-grow items-center text-center px-5">
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
        <main className="flex justify-center flex-grow items-center text-center px-5">
          <h1 className="text-4xl font-semibold pt-20">Error! Invalid User ID</h1>
        </main>
      </>
    );
  }

  const calcDisplayName = () => {
    const slicedName = userInfo.username.slice(0, userInfo.username.lastIndexOf("#"));
    if (slicedName.slice(-1) === "s" || slicedName.slice(-1) === "S") {
      return `${slicedName}'`;
    } else {
      return `${slicedName}'s`;
    }
  };

  return (
    <>
      <Head>
        <title>{userInfo.username} | DeckThemes</title>
      </Head>
      <main className="flex flex-col items-center w-full">
        <PfpDisplay userData={userInfo} />
        <div className="mt-4" />
        <ThemeCategoryDisplay
          typeOptionPreset="All"
          themeDataApiPath={`/users/${parsedId}/themes`}
          filterDataApiPath={`/users/${parsedId}/themes/filters`}
          title={`${calcDisplayName()} Themes`}
          noAuthRequired
        />
        {accountInfo?.permissions.includes(Permissions.admin) && (
          <>
            <BigDivider />
            <ThemeCategoryDisplay
              typeOptionPreset="All"
              themeDataApiPath={`/users/${parsedId}/stars`}
              filterDataApiPath={`/users/${parsedId}/stars/filters`}
              title={`${calcDisplayName()} Stars`}
            />
            <BigDivider />
            <ThemeCategoryDisplay
              typeOptionPreset="All"
              themeDataApiPath={`/users/${parsedId}/submissions`}
              filterDataApiPath={`/users/${parsedId}/submissions/filters`}
              title={`${calcDisplayName()} Submissions`}
              useSubmissionCards
              showFiltersWithZero
              defaultFilter="AwaitingApproval"
            />
          </>
        )}
      </main>
    </>
  );
}
