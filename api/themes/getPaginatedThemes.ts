import { ThemeQueryResponse } from "../../types";

export function getPaginatedThemes() {
  const themes: Promise<ThemeQueryResponse> = fetch(`${process.env.API_URL}/css_themes`, {
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
      console.error("CSS Theme Fetching Failed!", err);
    });
  return themes;
}
