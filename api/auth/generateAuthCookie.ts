export function generateAuthCookie(token: string) {
  const d = new Date();
  d.setTime(d.getTime() + (7 * 24 - 1) * 60 * 60 * 1000);
  document.cookie = `authToken=${token}; expires=${d.toUTCString()}; secure=true; SameSite=none;`;
  return true;
}
