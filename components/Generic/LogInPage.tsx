import Head from "next/head";
import { fetchDiscordUrl } from "../../apiHelpers";

export function LogInPage() {
  return (
    <>
      <Head>
        <title>DeckThemes | Log In</title>
      </Head>
      <main className="flex flex-col items-center px-5 text-center">
        <h1 className="pt-20 text-4xl font-semibold">You Are Not Logged In</h1>
        <button
          className="pt-10 text-5xl font-medium text-discordColor"
          onClick={fetchDiscordUrl}
        >
          <span>Login</span>
        </button>
      </main>
    </>
  );
}
