import Head from "next/head";
import Image from "next/image";

export function UnauthorizedPage() {
  return (
    <>
      <Head>
        <title>DeckThemes | Unauthorized</title>
      </Head>
      <main className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center px-10">
          <h2 className="pt-8 pb-4 text-5xl font-bold">Unauthorized</h2>
          <span>You do not have permission to view this page</span>
          <Image
            src="/unauthorized.png"
            alt="Unauthorized Picture"
            width="128"
            height="128"
          />
        </div>
      </main>
    </>
  );
}
