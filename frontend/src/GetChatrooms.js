import axios from "axios";
import { getUserId } from './GetUserId';

export const getChatrooms = async () => {
    try {
        const userId = await getUserId();
        if (!userId) {
            console.error("User ID not found.");
            return [];
        }

        const res = await axios.get(`http://localhost:5000/api/chatrooms/rooms/${userId}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching chatrooms:", err.response?.data || err.message);
        return [];
    }
};  

export default getChatrooms;
