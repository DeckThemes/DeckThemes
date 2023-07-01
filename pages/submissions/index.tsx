import Head from "next/head";
import { LoadingPage, UnauthorizedPage, LogInPage, ThemeCategoryDisplay } from "../../components";
import { useHasCookie } from "../../hooks";
import { authContext } from "contexts";
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
