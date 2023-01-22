import { toast } from "react-toastify";
import { genericGET } from "../genericFetches";

export async function fetchDiscordUrl() {
  genericGET(`/auth/oauth_redirect?redirect=${process.env.NEXT_PUBLIC_CLIENT_URL}/auth/`).then(
    (json) => {
      if (!json?.uri) {
        toast.error("Unable to generate authentication URL!");
        throw new Error("No URI In Response");
      }
      location.assign(json.uri);
    }
  );
}
