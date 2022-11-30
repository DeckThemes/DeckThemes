import { FullCSSThemeInfo } from "../../types";

export function getThemeById(id: string) {
  const themeData: Promise<FullCSSThemeInfo> = fetch(`${process.env.API_URL}/css_themes/${id}`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => {
      if (res.status < 200 || res.status >= 300 || !res.ok) {
        throw new Error("Response Not OK " + res.status);
      }
      return res.json();
    })
    .catch((err) => {
      console.error("CSS Theme Fetch Failed!", err);
    });
  return themeData;
}
