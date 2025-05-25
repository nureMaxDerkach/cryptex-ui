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
import {Form, Formik} from "formik";
import * as Yup from 'yup';

interface LoginAndSignUpFormProps {
    isLoginForm: boolean;
    redirectNavigate: () => void;
}

const initialValues = {
    nickname: "",
    email: "",
    password: "",
}

const validationSchema = Yup.object().shape({
    nickname: Yup.string().max(40, "Nickname is too long").required("Nickname is required"),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password is too short').max(20, 'Password is too long').required('Password is required')
});


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
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    console.log(values);
                }}
                validateOnBlur={true}
                validateOnChange={false}
            >
                {({values, handleChange, handleSubmit, isSubmitting, errors, touched, handleBlur}) => (
                    <Form onSubmit={handleSubmit}>
                        <Column gap='16px'>
                            <FormWrapper>
                                <Row gap='16px' alignItems='center'>
                                    <Column>
                                        <Typography>Nickname:</Typography>
                                    </Column>
                                    <Column>
                                        <StyledTextField
                                            name='nickname'
                                            value={values.nickname}
                                            size='small'
                                            style={{backgroundColor: '#010A18'}}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.nickname && touched.nickname) && errors.nickname}
                                            error={!!(errors.nickname && touched.nickname)}
                                        />
                                    </Column>
                                </Row>
                                <Row gap='16px' alignItems='center'>
                                    <Column>
                                        <Typography>Email:</Typography>
                                    </Column>
                                    <Column>
                                        <StyledTextField
                                            name='email'
                                            type='email'
                                            value={values.email}
                                            size='small'
                                            style={{backgroundColor: '#010A18'}}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.email && touched.email) && errors.email}
                                            error={!!(errors.email && touched.email)}
                                        />
                                    </Column>
                                </Row>
                                <Row gap='16px' alignItems='center'>
                                    <Column>
                                        <Typography>Password:</Typography>
                                    </Column>
                                    <Column>
                                        <StyledTextField
                                            name="password"
                                            value={values.password}
                                            size='small'
                                            type="password"
                                            style={{backgroundColor: '#010A18'}}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={(errors.password && touched.password) && errors.password}
                                            error={!!(errors.password && touched.password)}
                                        />
                                    </Column>
                                </Row>
                            </FormWrapper>
                            <Column alignItems='flex-end'>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{borderRadius: '10px'}}
                                    type='submit'
                                    disabled={isSubmitting}
                                >
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
                    </Form>
                )}
            </Formik>
        </MainWrapper>
    )
}