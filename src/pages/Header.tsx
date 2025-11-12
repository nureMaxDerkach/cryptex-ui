import {Row} from "../components/Flex.tsx";
import {useTheme} from "@mui/material";
export const HeaderPage = () => {
    const theme = useTheme();

    return (
        <Row height='50px' sx={{ justifyContent: 'center', padding: '10px' }}>
            {theme.palette.mode === 'dark' && (
                <img
                    src='/logo_for_dark_theme.png'
                    alt="logo"
                    style={{ height: 40 }}
                />
            )}
            {theme.palette.mode === 'light' && (
                <img
                    src='/logo_for_light_theme.png'
                    alt="logo"
                    style={{ height: 40 }}
                />
            )}
        </Row>
    )
}