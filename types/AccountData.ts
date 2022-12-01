import { Dispatch, SetStateAction } from "react";

export type AccountData = {
  avatar: string;
  id: string;
  permission: number;
  username: string;
};

export interface AuthContextContents {
  accountInfo: AccountData | undefined;
  setAccountInfo:
    | Dispatch<SetStateAction<AccountData | undefined>>
    | ((info: AccountData | undefined) => void);
}
