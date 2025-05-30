import {Box, Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {Column} from "../components/Flex.tsx";

export default function WelcomePage() {
    const navigate = useNavigate();

    return (
        <>
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
                    </Column>
                </Column>
            </Box>
        </>
    )
}