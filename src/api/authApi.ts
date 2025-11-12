import axios from 'axios';
import type { ILogin, ISignUp } from '../types';

const API_BASE_URL = 'https://cryptex-back.onrender.com/api/auth';


export const loginAsync = async (data: ILogin): Promise<string> => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/login`, data);
        
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};


export const signUpAsync = async (data: ISignUp): Promise<string> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/registration`, data);
        
        return response.data;
    } catch (error) {
        console.error('Sign up failed:', error);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        throw new Error(error.response?.data?.message || 'Sign up failed');
    }
};