import {Box, Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useThemeContext} from "../contexts/UseThemeContext.tsx";
import {Column} from "../components/Flex.tsx";

export default function WelcomePage() {
    const navigate = useNavigate();
    const {toggleTheme} = useThemeContext();

    return (
        <Box style={{display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Column gap='16px'>
                <Typography>
                    Welcome to Cryptex
                </Typography>
                <Column gap='16px'>
                    <Button variant="contained" style={{textTransform: 'none'}} onClick={() => navigate('/login')}>
                        Log in
                    </Button>
                    <Button variant="contained" style={{textTransform: 'none'}} onClick={() => navigate('/sign-up')}>
                        Sign up
                    </Button>
                    <Button onClick={() => toggleTheme()} variant="outlined" color="primary">
                        Toggle Theme
                    </Button>
                </Column>
            </Column>
        </Box>
    )
}