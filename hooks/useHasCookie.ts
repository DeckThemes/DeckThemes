import { useState, useContext, useEffect } from "react";
import { authContext } from "contexts";

export function useHasCookie() {
  const { accountInfo } = useContext(authContext);

  const [hasCookie, setHasCookie] = useState<boolean>(true);
  useEffect(() => {
    const cookieStr = document.cookie;
    if (cookieStr) {
      const cookieObj = cookieStr
        .split(";")
        .map((v) => v.split("="))
        .reduce((acc: any, v) => {
          acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
          return acc;
        }, {});
      if (Object.keys(cookieObj).indexOf("authToken") >= 0) {
        setHasCookie(true);
        return;
      }
    }
    setHasCookie(false);
  }, [accountInfo]);
  return hasCookie;
}
