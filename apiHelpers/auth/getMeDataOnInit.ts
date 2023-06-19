import { toast } from "react-toastify";
import { AccountData } from "../../types";
import { checkAndRefreshToken, getCookieToken } from "../genericFetches";

export async function getMeDataOnInit(): Promise<AccountData | undefined> {
  const cookieStr = document.cookie;
  const debugEnv = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  process.env.NEXT_PUBLIC_DEV_MODE === "true" && console.log("cookies:", cookieStr);
  if (cookieStr) {
    const cookieObj = cookieStr
      .split(";")
      .map((v) => v.split("="))
      .reduce((acc: any, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
    if (Object.keys(cookieObj).indexOf("authToken") >= 0) {
      const waitForRefresh = await checkAndRefreshToken();
      if (waitForRefresh) {
        const meJson = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: debugEnv
            ? {
                Authorization: `Bearer ${getCookieToken()}`,
              }
            : {},
        })
          .then((res) => {
            if (res.status < 200 || res.status >= 300 || !res.ok) {
              throw new Error("Response Not OK");
            }
            return res.json();
          })
          .catch((err) => {
            toast.error(`Error Fetching User Data!, ${JSON.stringify(err)}`);
            console.error("Error Fetching User Data!", err);
          });
        return meJson;
      }
    }
  }
  return undefined;
}
