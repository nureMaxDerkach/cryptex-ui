export interface ISignUp {
    googleID: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber: string;
    age: number;
    country: string;
    adress: string;
    password: string;
    role: string;
}

export interface ILogin {
    email: string;
    password: string;
}
