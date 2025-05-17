import React, {useEffect, useState} from "react";
import {ThemeProvider as MuiThemeProvider} from "@mui/material/styles";
import {darkTheme, lightTheme} from "../theme/theme.ts";
import { ThemeContext } from "./UseThemeContext.tsx";

const THEME_KEY = "preferred-theme";

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [themeMode, setThemeMode] = useState< "light" | "dark">("light");
    const currentMuiTheme = themeMode === "light" ? lightTheme : darkTheme;

    useEffect(() => {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === "dark") {
            setThemeMode("dark");
        } else {
            setThemeMode("light");
        }
    }, []);

    const toggleTheme = () => {
        const newMode = themeMode === "dark" ? "light" : "dark";
        setThemeMode(newMode);
        localStorage.setItem(THEME_KEY, newMode);
    };

    return (
        <ThemeContext.Provider value={{ theme: currentMuiTheme, toggleTheme }}>
            <MuiThemeProvider theme={currentMuiTheme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

