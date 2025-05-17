import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#FFA600",
        },
        background: {
            default: "#FFFFFF",
        },
        text: {
            primary: "#010A18",
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#FFA600",
        },
        background: {
            default: "#1E1E1E",
        },
        text: {
            primary: "#ffffff",
        },
    },
});
