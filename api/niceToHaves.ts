export function generateParamStr(searchOpts: object) {
  // This can be done with 'new URLSearchParams(obj)' but I want more control
  let paramString = "?";
  Object.keys(searchOpts).forEach((key, i) => {
    // @ts-ignore  typescript doesn't know how object.keys works 🙄
    if (searchOpts[key]) {
      // @ts-ignore
      paramString += `${i !== 0 ? "&" : ""}${key}=${searchOpts[key]}`;
    }
  });
  return paramString;
}
