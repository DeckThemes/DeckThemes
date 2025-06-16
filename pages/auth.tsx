import { authContext } from "contexts";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { generateAuthCookie, getMeDataFromToken } from "../apiHelpers";
import { LoadingSpinner } from "../components";

export default function Auth() {
  const router = useRouter();
  const { setAccountInfo } = useContext(authContext);
  async function getAndSetMeData(token: string) {
    const meJson = await getMeDataFromToken(token);
    if (meJson?.username) {
      setAccountInfo(meJson);
      router.push(localStorage.getItem("authRedirect") || "/users/me");
    }
  }

  function validateCode(token: string) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/authenticate_discord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: token,
        redirectUrl: `${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/`,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Account Token Fetch Failed! Response Not OK");
        }
        return res.json();
      })
      .then((json) => {
        if (!json?.token) {
          throw new Error("Account Token Fetch Failed! No Token In Response");
        }
        generateAuthCookie(json.token);
        getAndSetMeData(json.token);
      })
      .catch((err) => {
        toast.error(
          `Error Authenticating! ${JSON.stringify(err instanceof Error ? err.message : err)}`
        );
        console.error("Account Token Fetch Failed:", err);
      });
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const potentialCode = urlParams.get("code");
    if (potentialCode) {
      validateCode(potentialCode);
    } else {
    }
  }, []);

  return (
    <>
      <Head>
        <title>DeckThemes | Authenticating</title>
      </Head>
      <main className="flex h-full w-full flex-grow items-center justify-center gap-2">
        <LoadingSpinner />
        <h1 className="text-4xl font-semibold">Loading</h1>
      </main>
    </>
  );
}
