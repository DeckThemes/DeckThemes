import Head from "next/head";
import { LoadingPage, UnauthorizedPage, LogInPage, ThemeCategoryDisplay } from "../../components";
import { useHasCookie } from "../../hooks";
import { authContext } from "../_app";
import { useContext } from "react";
import { Permissions } from "../../types";

export default function Submissions() {
  const { accountInfo } = useContext(authContext);
  const hasCookie = useHasCookie();

  if (accountInfo?.permissions.includes(Permissions.viewSubs)) {
    return (
      <>
        <Head>
          <title>DeckThemes | Submissions</title>
        </Head>
        <main className="flex flex-col items-center page-shadow border-[1px] dark:border-borders-base1-dark dark:bg-base-2-dark py-12 mx-4 rounded-3xl">
          <div className="flex flex-col items-center justify-center px-10">
            <h2 className="font-bold text-5xl pt-8 pb-4">Submissions</h2>
            <ThemeCategoryDisplay
              themeDataApiPath="/submissions"
              filterDataApiPath="/submissions/filters"
              title=""
              showFiltersWithZero
              useSubmissionCards
              themesPerPage={20}
              typeOptionPreset="CSS+Audio"
              defaultFilter="AwaitingApproval"
            />
          </div>
        </main>
      </>
    );
  }

  if (accountInfo?.username && !accountInfo?.permissions?.includes(Permissions.viewSubs)) {
    return <UnauthorizedPage />;
  }

  if (hasCookie) {
    return <LoadingPage />;
  }
  return <LogInPage />;
}
