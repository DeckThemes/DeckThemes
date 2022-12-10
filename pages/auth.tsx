import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { generateAuthCookie, getMeDataFromToken } from "../api";
import { authContext } from "./_app";

export default function Auth() {
  const router = useRouter();
  const { setAccountInfo } = useContext(authContext);
  async function getAndSetMeData(token: string) {
    const meJson = await getMeDataFromToken(token);
    if (meJson?.username) {
      setAccountInfo(meJson);
      router.push("/me");
    }
  }

  function validateCode(token: string) {
    fetch(`${process.env.API_URL}/auth/authenticate_discord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: token,
        redirectUrl: `${process.env.CLIENT_URL}/auth/`,
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
    <div>
      <h1>Loading</h1>
    </div>
  );
}
