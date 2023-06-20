import Head from "next/head";
import {
  LoadingPage,
  UnauthorizedPage,
  LogInPage,
  ThemeCategoryDisplay,
} from "../../components";
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
        <main className="page-shadow mx-4 flex flex-col items-center rounded-3xl border-[1px] py-12 dark:border-borders-base1-dark dark:bg-base-2-dark">
          <div className="flex flex-col items-center justify-center px-10">
            <h2 className="pt-8 pb-4 text-5xl font-bold">Submissions</h2>
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

  if (
    accountInfo?.username &&
    !accountInfo?.permissions?.includes(Permissions.viewSubs)
  ) {
    return <UnauthorizedPage />;
  }

  if (hasCookie) {
    return <LoadingPage />;
  }
  return <LogInPage />;
}
