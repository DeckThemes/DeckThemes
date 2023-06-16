import Head from "next/head";
import { fetchDiscordUrl } from "../../apiHelpers";

export function LogInPage() {
  return (
    <>
      <Head>
        <title>DeckThemes | Log In</title>
      </Head>
      <main className="flex flex-col items-center text-center px-5">
        <h1 className="text-4xl font-semibold pt-20">You Are Not Logged In</h1>
        <button className="text-discordColor font-medium text-5xl pt-10" onClick={fetchDiscordUrl}>
          <span>Login</span>
        </button>
      </main>
    </>
  );
}
