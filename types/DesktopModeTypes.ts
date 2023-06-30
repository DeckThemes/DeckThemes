import { Dispatch, SetStateAction } from "react";

export type InstalledTheme = { name: string; id: string; version: string };

export interface DesktopModeContextContents {
  desktopMode: boolean | undefined;
  setDesktopMode: Dispatch<SetStateAction<boolean | undefined>>;
  installing: boolean;
  setInstalling: Dispatch<SetStateAction<boolean>>;
  installedThemes: InstalledTheme[];
  setInstalledThemes: Dispatch<SetStateAction<InstalledTheme[]>>;
}
