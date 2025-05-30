import {Row} from "../components/Flex.tsx";
import {Button} from "@mui/material";
import {useThemeContext} from "../contexts/UseThemeContext.tsx";

export const FooterPage = () => {
    const {toggleTheme} = useThemeContext();

    return (
        <Row height='50px'   sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'flex-end',
            padding: '12px',
        }}>
            <Button onClick={() => toggleTheme()} variant="outlined" color="primary">
                Toggle Theme
            </Button>
        </Row>
    )
}