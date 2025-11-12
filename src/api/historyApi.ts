import api from './api';
import { getUserIdFromToken } from '../utils/authUtils';
import { type ITransaction } from '../types';

export const fetchHistoryAsync = async (): Promise<ITransaction[]> => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    try {
        const response = await api.get<ITransaction[]>(`/user/${userId}/history`);
        return response.data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch transaction history');
    }
};