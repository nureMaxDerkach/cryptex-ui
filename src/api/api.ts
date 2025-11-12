import axios from 'axios';

const API_BASE_URL = 'https://cryptex-back.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Ця функція буде спрацьовувати перед кожним запитом
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;