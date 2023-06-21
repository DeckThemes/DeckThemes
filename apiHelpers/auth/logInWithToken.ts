import { genericGET } from "apiHelpers/genericFetches";
import { generateAuthCookie } from "./generateAuthCookie";
import { toast } from "react-toastify";

export async function logInWithToken(shortTokenValue: string) {
  if (shortTokenValue.length === 12) {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/authenticate_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: shortTokenValue }),
    })
      .then((res) => {
        // @ts-ignore
        return res.json();
      })
      .then((json) => {
        if (json) {
          return json;
        }
        throw new Error(`No json returned!`);
      })
      .then((data) => {
        if (data && data?.token) {
          generateAuthCookie(data.token);
          return genericGET("/auth/me").catch((err) => {
            toast.error(`Error Fetching User Data!, ${JSON.stringify(err)}`);
            console.error("Error Fetching User Data!", err);
          });
        } else {
          toast("Error Authenticating");
        }
      })
      .catch((err) => {
        console.error(`Error authenticating from short token.`, err);
      });
  } else {
    toast("Invalid Token");
  }
  return {};
}
