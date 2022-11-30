import { createContext, Dispatch, SetStateAction } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextContents {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>> | ((theme: string) => void);
}

export const themeContext = createContext<ThemeContextContents>({
  theme: "light",
  setTheme: () => {},
});
