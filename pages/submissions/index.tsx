import Head from "next/head";
import Image from "next/image";
import { LoadingSpinner, UserThemeCategoryDisplay } from "../../components";
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
        <main className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center px-10">
            <h2 className="font-bold text-5xl pt-8 pb-4">Submissions</h2>
            <UserThemeCategoryDisplay
              themeDataApiPath="/submissions"
              filterDataApiPath="/submissions/filters"
              title=""
              useSubmissionCards
              themesPerPage={20}
              addPluginChoice
              defaultFilter="AwaitingApproval"
            />
          </div>
        </main>
      </>
    );
  }

  if (accountInfo?.username && !accountInfo?.permissions?.includes(Permissions.viewSubs)) {
    return (
      <>
        <Head>
          <title>DeckThemes | Unauthorized</title>
        </Head>
        <main className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center px-10">
            <h2 className="font-bold text-5xl pt-8 pb-4">Unauthorized</h2>
            <span>You do not have permission to view this page</span>
            <Image src="/unauthorized.png" alt="Unauthorized Picture" width="128" height="128" />
          </div>
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
}
