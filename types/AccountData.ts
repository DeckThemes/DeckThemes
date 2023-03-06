import { Dispatch, SetStateAction } from "react";
import { PartialCSSThemeInfo } from "./CSSThemeTypes";

export enum Permissions {
  "editAny" = "EditAnyPost",
  "approveSubs" = "ApproveThemeSubmissions",
  "viewSubs" = "ViewThemeSubmissions",
  "admin" = "ManageApi",
}

export type PremiumTiers = "None" | "Tier1" | "Tier2" | "Tier3";
export interface UserInfo {
  premiumTier: PremiumTiers;
  permissions: Permissions[];
  id: string;
  username: string;
  avatar: string;
}

export type AccountData = UserInfo;

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
