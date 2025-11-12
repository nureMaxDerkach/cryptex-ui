import api from './api';

interface ApiError {
    message: string;
}

/**
 * Надсилає запит на купівлю монети
 * @param userId - ID користувача
 * @param coinId - ID монети (наприклад, 0 для BTC)
 * @param amount - Сума (наприклад, 100 для 100 USDT)
 */
export const buyCoinAsync = async (userId: string, coinId: number, amount: number) => {
    try {
        const response = await api.post(
            `/user/${userId}/wallet/buy`,
            null,
            {
                params: {
                    coin: coinId,
                    amount: amount
                }
            }
        );
        return response.data;
    } catch (error: any) {
        const apiError = error.response?.data as ApiError;
        throw new Error(apiError?.message || 'Failed to execute buy order');
    }
};

/**
 * Надсилає запит на продаж монети
 */
export const sellCoinAsync = async (userId: string, coinId: number, amount: number) => {
    try {
        const response = await api.post(
            `/user/${userId}/wallet/sell`,
            null,
            {
                params: {
                    coin: coinId,
                    amount: amount
                }
            }
        );
        return response.data;
    } catch (error: any) {
        const apiError = error.response?.data as ApiError;
        throw new Error(apiError?.message || 'Failed to execute sell order');
    }
};