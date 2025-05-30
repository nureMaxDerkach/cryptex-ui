import {Button, styled, TextField} from "@mui/material";
import {Column} from "../Flex.tsx";

export const MainWrapper = styled(Column)`
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    gap: 16px;
`

export const FormWrapper = styled(Column)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#0C1D37' : '#F3F6FC',
    padding: '10px',
    borderRadius: '4px',
    gap: '16px',
}));

export const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        color: 'white',
        borderColor: '#FFA600',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFA600',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFA600',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFA600',
    },
});

export const RedirectStyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#010A18',
    borderColor: theme.palette.mode === 'dark' ? '#FFFFFF' : '#010A18',
    width: '75%',
    borderRadius: '10px',
}));

export const ExternalProviderStyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#010A18',
    width: '80%',
    borderRadius: '10px',
}));
