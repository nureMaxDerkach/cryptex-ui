import axios from "axios";

export const getUserByIdAsync = async (userId: string, token: string) => {
    const response = await axios.get(`http://localhost:5000/api/user/${userId}`, { headers: { Authorization: token } }, );
    return response.data;
}

export const changeUserBalanceAsync = async (userId: string, balance: number, token: string) : Promise<void> => {
    const response = await axios.patch(`http://localhost:5000/api/user/${userId}/change-balance?balance=${balance}`, {}, { headers: { "Authorization": token } });
    return response.data;
}