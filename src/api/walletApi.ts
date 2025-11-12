import api from './api';
import {getUserIdFromToken} from '../utils/authUtils';
import {type IWalletResponse} from "../types";


export const fetchWalletDataAsync = async (): Promise<IWalletResponse> => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    try {
        const response = await api.get<IWalletResponse>(`/user/${userId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch wallet data');
    }
};