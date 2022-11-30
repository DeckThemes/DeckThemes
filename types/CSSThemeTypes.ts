import { Url } from "url";
import { AccountData, FullAccountData } from "./AccountData";
import { APIBlob } from "./BlobTypes";

export interface UserInfo {
  id: string;
  username: string;
  avatar: Url;
}

export interface MinimalCSSThemeInfo {
  id: string;
  name: string;
  version: string;
  target: string;
  manifestVersion: number;
  specifiedAuthor: string;
}

export interface PartialCSSThemeInfo extends MinimalCSSThemeInfo {
  images: APIBlob[];
  download: APIBlob;
  author: UserInfo;
  submitted: Date;
  updated: Date;
}

export interface FullCSSThemeInfo extends PartialCSSThemeInfo {
  dependencies: MinimalCSSThemeInfo[];
  approved: boolean;
  disabled: boolean;
  description: string;
  source?: string;
}

export interface QueryResponseShell {
  total: number;
}

export interface ThemeQueryResponse extends QueryResponseShell {
  items: PartialCSSThemeInfo[];
}

export interface ThemeQueryRequest {
  page: number;
  perPage: number;
  filters: string;
  order: string;
  search: string;
}

export interface ThemeSubmissionQueryResponse extends QueryResponseShell {
  items: ThemeSubmissionInfo[];
}

export interface ThemeSubmissionInfo {
  id: string;
  intent: number;
  message: string | null;
  new: FullCSSThemeInfo;
  old: MinimalCSSThemeInfo | null;
  owner: FullAccountData;
  reviewedBy: AccountData | null;
  status: number;
  submitted: Date;
}

export interface FilterQueryResponse {
  filters: string[];
  order: string[];
}
