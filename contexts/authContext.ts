import { AuthContextContents } from "@customTypes/AccountData";
import { createContext } from "react";

export const authContext = createContext<AuthContextContents>({
  accountInfo: undefined,
  setAccountInfo: () => {},
});
