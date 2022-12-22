import Head from "next/head";
import { UserThemeCategoryDisplay } from "../../components";

export default function Submissions() {
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
          />
        </div>
      </main>
    </>
  );
}
