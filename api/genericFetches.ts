import { clearCookie, generateAuthCookie } from "./auth";

export async function fetchWithRefresh(fetchFunc: any) {
  const waitForRefresh = await checkAndRefreshToken();
  if (waitForRefresh) {
    return await fetchFunc();
  }
  console.warn("Error Refreshing Token!");
}

export async function checkAndRefreshToken() {
  const debug = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  const expiryDate = localStorage.tokenExpiryDate;
  // If no expiry date (never logged in before)
  if (expiryDate === undefined) {
    // This is for a person who isn't logged in, so that the site still functions
    debug && console.log("No Cookie Expiry Date Value!");
    return true;
  }
  // If token is still valid
  if (new Date().valueOf() < expiryDate) {
    debug && console.log("Cookie Is Up To Date");
    return true;
  }
  // If it's been longer than a week (cookie expired and requires full re-log in)
  const cookieStr = document.cookie;
  if (cookieStr) {
    const cookieObj = cookieStr
      .split(";")
      .map((v) => v.split("="))
      .reduce((acc: any, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
    console.log(Object.keys(cookieObj).indexOf("authToken"));
    if (Object.keys(cookieObj).indexOf("authToken") < 0) {
      clearCookie();
      // It still returns true as this needs to return for essential functions like the get discord url to work
      return true;
    }
  } else {
    // This is if there's no cookie
    return true;
  }
  debug && console.log("REFRESHING TOKEN");
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh_token`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      debug && console.log("New Token Fetch Res", res);
      if (res.status < 200 || res.status >= 300 || !res.ok) {
        debug && console.log("Token Refresh Failed");
        clearCookie();
      }
      return res.json();
    })
    .then((json) => {
      if (json?.token) {
        debug && console.log("Setting New Cookie");
        generateAuthCookie(json.token);
        return true;
      } else {
        console.log(`Couldn't Refresh token, ${json?.message || "Unknown"}`);
        clearCookie();
        return false;
      }
    })
    .catch((err) => {
      console.error(`Error Refreshing Token`, err);
    });
}

export async function genericGET(subPath: string, debug: boolean = false) {
  const waitForRefresh = await checkAndRefreshToken();
  if (waitForRefresh) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${subPath}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        debug && debug && console.log(`${subPath} Fetch Res: `, res);
        if (res.status < 200 || res.status >= 300 || !res.ok) {
          throw new Error("Response Not OK");
        }
        return res.json();
      })
      .then((json) => {
        debug && debug && console.log(`${subPath} Fetch Json: `, json);
        if (json) {
          return json;
        }
        throw new Error("Couldn't find data");
      })
      .catch((err) => {
        console.error(`Error fetching from ${subPath}`, err);
      });
  } else {
    console.log("COOKIE REFRESH FAILED!", waitForRefresh);
  }
}
