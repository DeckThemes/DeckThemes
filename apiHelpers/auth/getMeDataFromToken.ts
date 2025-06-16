import { AccountData } from "@customTypes/AccountData";
import { toast } from "react-toastify";

export async function getMeDataFromToken(token: string): Promise<AccountData> {
  const meJson = fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me_full`, {
    method: "GET",
    credentials: "include",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
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
      toast.error(
        `Error Fetching User Data!, ${JSON.stringify(err instanceof Error ? err.message : err)}`
      );
      console.error("Account Data Fetch Failed!", err);
    });
  return meJson;
}
