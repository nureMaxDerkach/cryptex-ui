import api from './api';
import { getUserIdFromToken } from '../utils/authUtils';

export const withdrawFiatAsync = async (amount: number): Promise<any> => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    try {
        const response = await api.post(
            `/user/${userId}/withdraw`,
            null,
            {
                params: {
                    amount: amount
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to withdraw funds');
    }
};