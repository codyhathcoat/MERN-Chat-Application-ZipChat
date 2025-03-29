import React from "react";
import axios from "axios";

export const getChatroom = async (chatroomId) => {
    try {
        const res = await axios.get(`http://localhost:5000/api/chatrooms/${chatroomId}`);
        return res.data;
    } catch (err) {
        console.error("Error fetching chatroom:", err.response?.data || err.message);
        return null
    }
};

export default getChatroom