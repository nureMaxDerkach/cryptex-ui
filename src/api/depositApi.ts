import api from './api';
import { getUserIdFromToken } from '../utils/authUtils';

export const depositFiatAsync = async (amount: number): Promise<any> => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    try {
        const response = await api.patch(
            `/user/${userId}/deposit`,
            null,
            {
                params: {
                    amount: amount
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to deposit funds');
    }
};