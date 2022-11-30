export async function fetchDiscordUrl() {
  fetch(`${process.env.API_URL}/auth/oauth_redirect?redirect=http://localhost:3000/auth/`)
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
