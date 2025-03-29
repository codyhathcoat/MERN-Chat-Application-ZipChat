import React, {useState, useEffect} from "react";
import axios from "axios";

const Chatrooms = ({refresh}) => { //Added refresh
    const [chatrooms, setChatrooms] = useState([]);

    const fetchChatrooms = async () => {
        try{
            const res = await axios.get("http://localhost:5000/api/chatrooms");
            setChatrooms(res.data);
        } catch(err){
            console.error("Error fetching chatrooms:", err);
        }
    };

    useEffect(() => {
        fetchChatrooms();
    }, [refresh]);

    return (
        <div>
            <h2>Chatrooms</h2>
            <ul>
                {chatrooms.map(chat => (
                    <li key = {chat._id}>{chat.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Chatrooms;

