export async function genericGET(subPath: string, errMessage: string, debug: boolean = false) {
  return await fetch(`${process.env.API_URL}${subPath}`, {
    method: "GET",
    credentials: "include",
  })
    .then((res) => {
      debug && console.log(`${subPath} Fetch Res: `, res);
      if (res.status < 200 || res.status >= 300 || !res.ok) {
        throw new Error("Response Not OK");
      }
      return res.json();
    })
    .then((json) => {
      debug && console.log(`${subPath} Fetch Json: `, json);
      if (json) {
        return json;
      }
      throw new Error("Couldn't find data");
    })
    .catch((err) => {
      console.error(`${errMessage}`, err);
    });
}
