import {Button, Typography, useTheme} from "@mui/material";
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
import type {ILoginAndSignUpForm} from "../../types.ts";

interface LoginAndSignUpFormProps {
    isLoginForm: boolean;
    redirectNavigate: () => void;
    onSubmit: (values: ILoginAndSignUpForm) => void
}

const initialValues: ILoginAndSignUpForm = {
    name: "",
    email: "",
    password: "",
}

const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).max(20).required("Password is required"),
});

const signUpSchema = Yup.object({
    name: Yup.string().max(40).required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).max(20).required("Password is required"),
});

export default function LoginAndSignUpComponent({redirectNavigate, isLoginForm, onSubmit}: LoginAndSignUpFormProps) {
    const theme = useTheme();
    const title = isLoginForm ? "Log in" : "Sign up";
    const redirectTitle = isLoginForm ? "Sign up" : "Log in";
    const validationSchema = isLoginForm ? loginSchema : signUpSchema;

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
                onSubmit={(values) => onSubmit(values)}
                validateOnBlur={true}
                validateOnChange={false}
            >
                {({values, handleChange, handleSubmit, isSubmitting, errors, touched, handleBlur}) => (
                    <Form onSubmit={handleSubmit}>
                        <Column gap='16px'>
                            <FormWrapper>
                                {!isLoginForm && (
                                    <Row gap='16px' alignItems='center'>
                                        <Column>
                                            <Typography>Name:</Typography>
                                        </Column>
                                        <Column>
                                            <StyledTextField
                                                name='name'
                                                value={values.name}
                                                size='small'
                                                style={{backgroundColor: theme.palette.mode === "dark" ? '#010A18' : '#FFFFFF'}}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                helperText={(errors.name && touched.name) && errors.name}
                                                error={!!(errors.name && touched.name)}
                                            />
                                        </Column>
                                    </Row>
                                )}
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
                                            style={{backgroundColor: theme.palette.mode === "dark" ? '#010A18' : '#FFFFFF'}}
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
                                            style={{backgroundColor: theme.palette.mode === "dark" ? '#010A18' : '#FFFFFF'}}
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