import axios from 'axios';
import type {ILogin, ISignUp} from "../types.ts";

export const signUpAsync = async (data: ISignUp) : Promise<string> => {
    const response = await axios.post("http://localhost:5000/api/auth/registration", data)
    return response.data;
}

export const loginAsync = async (data: ILogin) : Promise<string> => {
    const response = await axios.post("http://localhost:5000/api/auth/login", data)
    return response.data;
}