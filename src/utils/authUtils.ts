import {jwtDecode} from 'jwt-decode';

// Інтерфейс для даних, що зберігаються в токені
interface DecodedToken {
    Id: string;
    email: string;
    Name: string;
    "Surname": string,
    "role": string,
    "nbf": number,
    "exp": number,
    "iat": number,
    "iss": string,
    "aud": string
}

/**
 * Отримує ID користувача з JWT-токена в localStorage.
 */
export const getUserIdFromToken = (): string | null => {
    try {
        const tokenString = localStorage.getItem('token');
        if (!tokenString) {
            console.error('No token found in localStorage');
            return null;
        }

        const jwt = tokenString.split(' ')[1];
        if (!jwt) {
            console.error('Token format is incorrect');
            return null;
        }

        const decoded: DecodedToken = jwtDecode(jwt);
        return decoded.Id;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};