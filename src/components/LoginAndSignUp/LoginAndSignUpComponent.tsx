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

// Оновлено: додані нові поля
const initialValues: ILoginAndSignUpForm = {
    name: "",
    surname: "",
    email: "",
    password: "",
    phoneNumber: "",
    age: "",
    country: "",
    adress: "",
}

const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).max(20).required("Password is required"),
});

// Оновлено: валідація для нових полів
const signUpSchema = Yup.object({
    name: Yup.string().max(40).required("Name is required"),
    surname: Yup.string().max(40).required("Surname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6).max(20).required("Password is required"),
    phoneNumber: Yup.string().matches(/^[0-9+]+$/, "Must be only digits or +").min(10).required("Phone number is required"),
    age: Yup.number().typeError("Must be a number").min(18, "Must be 18 or older").required("Age is required"),
    country: Yup.string().required("Country is required"),
    adress: Yup.string().required("Address is required"),
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
                                    <>
                                        {/* Name Field */}
                                        <Row gap='16px' alignItems='center'>
                                            <Column><Typography>Name:</Typography></Column>
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

                                        {/* Surname */}
                                        <Row gap='16px' alignItems='center'>
                                            <Column><Typography>Surname:</Typography></Column>
                                            <Column>
                                                <StyledTextField
                                                    name='surname'
                                                    value={values.surname}
                                                    size='small'
                                                    style={{backgroundColor: theme.palette.mode === "dark" ? '#010A18' : '#FFFFFF'}}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.surname && touched.surname) && errors.surname}
                                                    error={!!(errors.surname && touched.surname)}
                                                />
                                            </Column>
                                        </Row>
                                    </>
                                )}

                                {/* Email Field */}
                                <Row gap='16px' alignItems='center'>
                                    <Column><Typography>Email:</Typography></Column>
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

                                {/* Password Field */}
                                <Row gap='16px' alignItems='center'>
                                    <Column><Typography>Password:</Typography></Column>
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

                                {!isLoginForm && (
                                    <>
                                        {/* Phone Number */}
                                        <Row gap='16px' alignItems='center'>
                                            <Column><Typography>Phone:</Typography></Column>
                                            <Column>
                                                <StyledTextField
                                                    name='phoneNumber'
                                                    value={values.phoneNumber}
                                                    size='small'
                                                    style={{backgroundColor: theme.palette.mode === "dark" ? '#010A18' : '#FFFFFF'}}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.phoneNumber && touched.phoneNumber) && errors.phoneNumber}
                                                    error={!!(errors.phoneNumber && touched.phoneNumber)}
                                                />
                                            </Column>
                                        </Row>

                                        {/* Age */}
                                        <Row gap='16px' alignItems='center'>
                                            <Column><Typography>Age:</Typography></Column>
                                            <Column>
                                                <StyledTextField
                                                    name='age'
                                                    value={values.age}
                                                    size='small'
                                                    type='number' // Допомагає з валідацією
                                                    style={{backgroundColor: theme.palette.mode === "dark" ? '#010A18' : '#FFFFFF'}}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.age && touched.age) && errors.age}
                                                    error={!!(errors.age && touched.age)}
                                                />
                                            </Column>
                                        </Row>

                                        {/* Country */}
                                        <Row gap='16px' alignItems='center'>
                                            <Column><Typography>Country:</Typography></Column>
                                            <Column>
                                                <StyledTextField
                                                    name='country'
                                                    value={values.country}
                                                    size='small'
                                                    style={{backgroundColor: theme.palette.mode === "dark" ? '#010A18' : '#FFFFFF'}}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.country && touched.country) && errors.country}
                                                    error={!!(errors.country && touched.country)}
                                                />
                                            </Column>
                                        </Row>

                                        {/* Address */}
                                        <Row gap='16px' alignItems='center'>
                                            <Column><Typography>Address:</Typography></Column>
                                            <Column>
                                                <StyledTextField
                                                    name='adress'
                                                    value={values.adress}
                                                    size='small'
                                                    style={{backgroundColor: theme.palette.mode === "dark" ? '#010A18' : '#FFFFFF'}}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={(errors.adress && touched.adress) && errors.adress}
                                                    error={!!(errors.adress && touched.adress)}
                                                />
                                            </Column>
                                        </Row>
                                    </>
                                )}
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