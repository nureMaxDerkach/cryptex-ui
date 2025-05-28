export interface ISignUp {
    googleID: string | null;
    email: string;
    name: string;
    surname: string | null;
    phoneNumber: string | null;
    age: number;
    country: string | null;
    adress: string | null;
    password: string;
    role: string | null;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginAndSignUpForm {
    email: string;
    password: string;
    name: string;
}
