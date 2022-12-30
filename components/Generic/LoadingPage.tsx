import Head from "next/head";
import { LoadingSpinner } from "./LoadingSpinner";

export function LoadingPage() {
  return (
    <>
      <Head>
        <title>DeckThemes | Loading</title>
      </Head>
      <div className="flex-grow flex justify-center h-full w-full mt-8 text-center items-center text-3xl font-semibold gap-4">
        <LoadingSpinner />
        <span>Loading</span>
      </div>
    </>
  );
}
