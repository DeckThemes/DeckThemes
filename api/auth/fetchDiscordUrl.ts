export async function fetchDiscordUrl() {
  fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth_redirect?redirect=${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/`,
    {
      method: "GET",
      credentials: "include",
    }
  )
    .then((res) => {
      if (res.status < 200 || res.status >= 300 || !res.ok) {
        throw new Error("Response Not OK");
      }
      return res.json();
    })
    .then((json) => {
      if (!json?.uri) {
        throw new Error("No URI In Response");
      }
      location.assign(json.uri);
    })
    .catch((err) => {
      console.error("Auth API Request Failed:", err);
    });
}
