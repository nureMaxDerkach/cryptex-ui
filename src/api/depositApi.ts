import api from './api';
import { getUserIdFromToken } from '../utils/authUtils';
import type {IWalletResponse} from "../types.ts";

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

export const depositCryptoAsync = async (
    userId: number,
    depositAddress: string,
    amount: number
): Promise<IWalletResponse> => {
    const response = await api.patch<IWalletResponse>(
        `/user/${userId}/deposit-crypto?depositAddress=${depositAddress}&amount=${amount}`
    );
    return response.data;
};