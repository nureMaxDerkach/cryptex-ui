import api from './api';
import { getUserIdFromToken } from '../utils/authUtils';
import { type IWalletResponse } from '../types';

/**
 * Надсилає запит на конвертацію однієї криптовалюти в іншу.
 * Повертає оновлені дані користувача.
 */
export const convertCoinAsync = async (
    coinForConvert: number,
    convertToCoin: number,
    amount: number
): Promise<IWalletResponse> => {
    const userId = getUserIdFromToken();
    if (!userId) {
        throw new Error('User not authenticated');
    }

    try {
        const response = await api.post<IWalletResponse>(
            `/user/${userId}/wallet/convert`,
            null,
            {
                params: {
                    coinForConvert,
                    convertToCoin,
                    amount
                }
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Exchange failed');
    }
};