import {createContext, useContext} from "react";
import type {Theme} from "@mui/material";

export interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useThemeContext must be used within ThemeContextProvider");
    return context;
};