import { DesktopModeContextContents } from "@customTypes/DesktopModeTypes";
import { createContext } from "react";

export const desktopModeContext = createContext<DesktopModeContextContents>({
  desktopMode: false,
  setDesktopMode: () => {},
  installing: false,
  setInstalling: () => {},
  installedThemes: [],
  setInstalledThemes: () => {},
});
