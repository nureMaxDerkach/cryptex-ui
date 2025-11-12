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
    name: string;
    surname: string;
    email: string;
    password: string;
    phoneNumber: string;
    age: string | number;
    country: string;
    adress: string;
}
