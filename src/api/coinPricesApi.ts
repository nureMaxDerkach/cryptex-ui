import api from './api'; // Імпортуємо ваш налаштований axios instance
import { Crypto, BinanceInterval } from '../data/constants.ts';
import type {ICoinPrice} from "../types.ts";

export const fetchCoinPriceHistory = async (
    coin: Crypto,
    periodOfTime: BinanceInterval
): Promise<ICoinPrice[]> => {

    const response = await api.get<ICoinPrice[]>('/coin/price-history', {
        params: {
            coin: coin,
            periodOfTime: periodOfTime
        }
    });

    return response.data;
};