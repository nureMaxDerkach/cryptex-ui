import api from './api';
import { type ITicket } from '../types';

// Отримати всі тікети користувача
export const fetchUserTickets = async (userId: number): Promise<ITicket[]> => {
    const response = await api.get<ITicket[]>(`/user/${userId}/tickets`);
    return response.data;
};

// Створити новий тікет
export const createTicketAsync = async (userId: number): Promise<ITicket> => {
    const response = await api.post<ITicket>(`/user/${userId}/tickets`, {});
    return response.data;
};

// Відправити повідомлення (опис проблеми)
export const sendMessageAsync = async (ticketId: number, authorId: number, message: string): Promise<void> => {
    await api.post(
        `/user/tickets/${ticketId}/messages?authorId=${authorId}`,
        JSON.stringify(message),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
};

// --- Support Agent Methods ---

// Отримати список відкритих тікетів (ніким не зайнятих)
export const getOpenTicketsAsync = async (): Promise<ITicket[]> => {
    const response = await api.get<ITicket[]>('/support/get-open-tickets');
    return response.data;
};

// Отримати поточний тікет, який сапорт взяв у роботу
export const getCurrentSupportTicketAsync = async (supportId: number): Promise<ITicket | null> => {
    try {
        const response = await api.get<ITicket>(`/support/current-ticket?supportId=${supportId}`);
        if (!response.data) return null;
        return response.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return null;
    }
};

// Взяти тікет в роботу
export const takeTicketAsync = async (supportId: number, ticketId: number): Promise<void> => {
    await api.post(`/support/take-ticket?supportId=${supportId}&ticketId=${ticketId}`);
};

// Закрити тікет
export const resolveTicketAsync = async (supportId: number, ticketId: number): Promise<void> => {
    await api.post(`/support/resolve-ticket?supportId=${supportId}&ticketId=${ticketId}`);
};