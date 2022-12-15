import { AccountData } from "../../types";

export async function getMeDataFromToken(token: string): Promise<AccountData> {
  const meJson = fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
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
      console.error("Account Data Fetch Failed!", err);
    });
  return meJson;
}
