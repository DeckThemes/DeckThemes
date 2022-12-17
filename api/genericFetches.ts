import { generateAuthCookie } from "./auth";

export async function checkAndRefreshToken() {
  const expiryDate = localStorage.tokenExpiryDate;
  if (expiryDate === undefined) {
    // This is for a person who isn't logged in, so that the site still functions
    process.env.NEXT_PUBLIC_DEV_MODE === "test" && console.log("No Cookie Expiry Date Value!");
    return true;
  }
  if (new Date().valueOf() < expiryDate) {
    process.env.NEXT_PUBLIC_DEV_MODE === "test" && console.log("Cookie Is Up To Date");
    return true;
  } else {
    process.env.NEXT_PUBLIC_DEV_MODE === "test" && console.log("REFRESHING TOKEN");
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh_token`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        process.env.NEXT_PUBLIC_DEV_MODE === "test" && console.log("New Token Fetch Res", res);
        if (res.status < 200 || res.status >= 300 || !res.ok) {
          throw new Error("Response Not OK");
        }
        return res.json();
      })
      .then((json) => {
        if (json?.token) {
          process.env.NEXT_PUBLIC_DEV_MODE === "test" && console.log("Setting New Cookie");
          generateAuthCookie(json.token);
          return true;
        } else {
          throw new Error("Couldn't find token");
        }
      })
      .catch((err) => {
        console.error(`Error Refreshing Token`, err);
      });
  }
}

export async function genericGET(subPath: string, errMessage: string, debug: boolean = false) {
  const waitForRefresh = await checkAndRefreshToken();
  if (waitForRefresh) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${subPath}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        process.env.NEXT_PUBLIC_DEV_MODE === "test" &&
          debug &&
          console.log(`${subPath} Fetch Res: `, res);
        if (res.status < 200 || res.status >= 300 || !res.ok) {
          throw new Error("Response Not OK");
        }
        return res.json();
      })
      .then((json) => {
        process.env.NEXT_PUBLIC_DEV_MODE === "test" &&
          debug &&
          console.log(`${subPath} Fetch Json: `, json);
        if (json) {
          return json;
        }
        throw new Error("Couldn't find data");
      })
      .catch((err) => {
        console.error(`${errMessage}`, err);
      });
  } else {
    console.log("COOKIE REFRESH FAILED!", waitForRefresh);
  }
}
