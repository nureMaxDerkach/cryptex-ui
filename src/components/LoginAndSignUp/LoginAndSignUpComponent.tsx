import {Button, Typography} from "@mui/material";
import {Column, Row} from "../Flex";
import {East} from "@mui/icons-material";
import {
    ExternalProviderStyledButton,
    FormWrapper,
    MainWrapper,
    RedirectStyledButton,
    StyledTextField
} from "./LoginAndSignUpStyled.ts";

interface LoginAndSignUpFormProps {
    isLoginForm: boolean;
    redirectNavigate: () => void;
}

export default function LoginAndSignUpComponent({redirectNavigate, isLoginForm}: LoginAndSignUpFormProps) {
    const title = isLoginForm ? "Log in" : "Sign up";
    const redirectTitle = isLoginForm ? "Sign up" : "Log in";

    return (
        <MainWrapper>
            <Column>
                <Typography variant="h4">
                    {title}
                </Typography>
            </Column>
            <Column gap='16px'>
                <FormWrapper>
                    <Row gap='16px' alignItems='center'>
                        <Column>
                            <Typography>Nickname:</Typography>
                        </Column>
                        <Column>
                            <StyledTextField size='small' style={{ backgroundColor: '#010A18' }}/>
                        </Column>
                    </Row>
                    <Row gap='16px' alignItems='center'>
                        <Column>
                            <Typography>Email:</Typography>
                        </Column>
                        <Column>
                            <StyledTextField size='small' style={{ backgroundColor: '#010A18' }}/>
                        </Column>
                    </Row>
                    <Row gap='16px' alignItems='center'>
                        <Column>
                            <Typography>Password:</Typography>
                        </Column>
                        <Column>
                            <StyledTextField size='small' type="password" style={{ backgroundColor: '#010A18' }}/>
                        </Column>
                    </Row>
                </FormWrapper>
                <Column alignItems='flex-end'>
                    <Button variant="contained" color="primary" style={{ borderRadius: '10px'}}>
                        <East/>
                    </Button>
                </Column>
                <Column alignItems='center'>
                    <Typography variant="h6">
                        or
                    </Typography>
                </Column>
                <FormWrapper>
                    <Column alignItems='center'>
                        <ExternalProviderStyledButton fullWidth variant="outlined" color="primary">
                            Continue with Google
                        </ExternalProviderStyledButton>
                    </Column>
                    <Column alignItems='center'>
                        <ExternalProviderStyledButton fullWidth variant="outlined" color="primary">
                            Use Facebook account
                        </ExternalProviderStyledButton>
                    </Column>
                </FormWrapper>
                <Column onClick={redirectNavigate} alignItems='center'>
                    <RedirectStyledButton variant="outlined">
                        {redirectTitle}
                    </RedirectStyledButton>
                </Column>
            </Column>
        </MainWrapper>
    )
}