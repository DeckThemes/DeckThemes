import { genericGET } from "../genericFetches";

export async function fetchDiscordUrl() {
  genericGET(`/auth/oauth_redirect?redirect=${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/`).then(
    (json) => {
      if (!json?.uri) {
        throw new Error("No URI In Response");
      }
      location.assign(json.uri);
    }
  );
}
