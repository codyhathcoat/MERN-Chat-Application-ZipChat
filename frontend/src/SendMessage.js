import axios from "axios";

export const sendMessage = async (chatroomId, senderId, content) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/chatrooms/${chatroomId}/message`, {
            sender: senderId,
            content
        });

        return response.data;
        
    } catch (err) {
        console.error(err);
        return null;
    }
};