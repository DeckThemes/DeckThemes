import { toast } from "react-toastify";
import { clearCookie, generateAuthCookie } from "./auth";

export async function fetchWithRefresh(fetchFunc: any) {
  const waitForRefresh = await checkAndRefreshToken();
  if (waitForRefresh) {
    return await fetchFunc();
  }
  console.warn("Error Refreshing Token!");
}

export async function checkAndRefreshToken() {
  const debugEnv = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  const expiryDate = localStorage.tokenExpiryDate;
  // If no expiry date (never logged in before)
  if (expiryDate === undefined) {
    // This is for a person who isn't logged in, so that the site still functions
    debugEnv && console.log("No Cookie Expiry Date Value!");
    return true;
  }
  // If token is still valid
  if (new Date().valueOf() < expiryDate) {
    debugEnv && console.log("Cookie Is Up To Date");
    return true;
  }
  // TODO: I think this can be refactored using the new getCookieToken(), just haven't taken a good look yet
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
    if (Object.keys(cookieObj).indexOf("authToken") < 0) {
      clearCookie();
      // It still returns true as this needs to return for essential functions like the get discord url to work
      return true;
    }
  } else {
    // This is if there's no cookie
    return true;
  }
  debugEnv && console.log("REFRESHING TOKEN");
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh_token`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => {
      debugEnv && console.log("New Token Fetch Res", res);
      if (res.status < 200 || res.status >= 300 || !res.ok) {
        debugEnv && console.log("Token Refresh Failed");
        clearCookie();
      }
      return res.json();
    })
    .then((json) => {
      if (json?.token) {
        debugEnv && console.log("Setting New Cookie");
        generateAuthCookie(json.token);
        return true;
      } else {
        clearCookie();
        toast.error(`Error re-authenticating! ${json?.message || "Unknown Error!"}`);
        return false;
      }
    })
    .catch((err) => {
      toast.error(`Error re-authenticating!, ${JSON.stringify(err)}`);
      console.error(`Error Refreshing Token`, err);
    });
}

export function getCookieToken() {
  const cookieStr = document.cookie;
  if (cookieStr) {
    const cookieObj = cookieStr
      .split(";")
      .map((v) => v.split("="))
      .reduce((acc: any, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc;
      }, {});
    if (Object.keys(cookieObj).indexOf("authToken") <= 0) {
      return cookieObj["authToken"];
    }
  } else {
    // This is if there's no cookie
    return false;
  }
}

export async function genericGET(subPath: string, debug: boolean = false) {
  const debugEnv = process.env.NEXT_PUBLIC_DEV_MODE === "true";
  const waitForRefresh = await checkAndRefreshToken();
  if (waitForRefresh) {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}${subPath}`, {
      method: "GET",
      credentials: "include",
      headers: debugEnv
        ? {
            Authorization: `Bearer ${getCookieToken()}`,
          }
        : {},
    })
      .then((res) => {
        debug && debugEnv && console.log(`${subPath} Fetch Res: `, res);
        if (res.status < 200 || res.status >= 300 || !res.ok) {
          throw new Error("Response Not OK");
        }
        return res.json();
      })
      .then((json) => {
        debug && debugEnv && console.log(`${subPath} Fetch Json: `, json);
        if (json) {
          return json;
        }
        throw new Error("Couldn't find data");
      })
      .catch((err) => {
        toast.error(`Error fetching ${subPath}!, ${JSON.stringify(err)}`);
        console.error(`Error fetching from ${subPath}`, err);
      });
  } else {
    console.log("COOKIE REFRESH FAILED!", waitForRefresh);
  }
}
