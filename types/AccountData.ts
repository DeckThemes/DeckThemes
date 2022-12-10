import { Dispatch, SetStateAction } from "react";
import { PartialCSSThemeInfo } from "./CSSThemeTypes";

export enum Permissions {
  "editAny" = "EditAnyPosts",
  "approveSubs" = "ApproveThemeSubmissions",
  "viewSubs" = "ViewThemeSubmissions",
  "admin" = "ManageApi",
}

export type AccountData = {
  avatar: string;
  id: string;
  permissions: Permissions[];
  username: string;
};

export interface AuthContextContents {
  accountInfo: AccountData | undefined;
  setAccountInfo:
    | Dispatch<SetStateAction<AccountData | undefined>>
    | ((info: AccountData | undefined) => void);
}

export interface StarContextContents {
  starredThemes: StarredThemeList | undefined;
  setStarredThemes:
    | Dispatch<SetStateAction<StarredThemeList | undefined>>
    | ((info: StarredThemeList | undefined) => void);
}

export interface StarredThemeList {
  total: number;
  items: PartialCSSThemeInfo[];
}
