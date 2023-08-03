import Head from "next/head";
import { LoadingSpinner } from "./LoadingSpinner";

export function LoadingPage() {
  return (
    <>
      <Head>
        <title>DeckThemes | Loading</title>
      </Head>
      <div className="my-64 flex h-full w-full flex-grow items-center justify-center gap-4 py-48 text-center text-3xl font-semibold">
        <LoadingSpinner />
        <span>Loading</span>
      </div>
    </>
  );
}
