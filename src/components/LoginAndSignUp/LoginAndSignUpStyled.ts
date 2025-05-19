import {Button, styled, TextField} from "@mui/material";
import {Column} from "../Flex.tsx";

export const MainWrapper = styled(Column)`
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    gap: 16px;
`

export const FormWrapper = styled(Column)`
    background-color: #0C1D37;
    padding: 10px;
    border-radius: 4px;
    gap: 16px;
`

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

export const RedirectStyledButton = styled(Button)`
    color: #FFFFFF;
    border-color: #FFFFFF;
    width: 75%;
    border-radius: 10px;
`

export const ExternalProviderStyledButton = styled(Button)`
    color: #FFFFFF;
    width: 80%;
    border-radius: 10px;
`