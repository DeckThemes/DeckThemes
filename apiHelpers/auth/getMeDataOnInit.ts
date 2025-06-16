import { toast } from "react-toastify";
import { AccountData } from "../../types";
import { genericGET } from "../genericFetches";

export async function getMeDataOnInit(): Promise<AccountData | undefined> {
  const cookieStr = document.cookie;
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
      return genericGET("/auth/me_full").catch((err) => {
        toast.error(
          `Error Fetching User Data!, ${JSON.stringify(err instanceof Error ? err.message : err)}`
        );
        console.error("Error Fetching User Data!", err);
      });
    }
  }
  return undefined;
}
