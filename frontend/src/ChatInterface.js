import React from "react";
import {useState} from "react";
import {sendMessage} from "./SendMessage";
import socket from "./socket";

const ChatInterface = ({chatroomId, sender, onMessageSent}) => {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSend = async () => {
        console.log("About to send message:", message);
        console.log("Sender:", sender);

        if (message.trim()) {
            try {
                const newMessage = await sendMessage(chatroomId, sender._id, message);
                console.log("API message response:", newMessage);
                socket.emit("send_message", {
                    room: chatroomId,
                    content: message,
                    sender: sender,
                    timestamp: new Date(),
                    //_id: newMessage._id
                });
                setMessage("");
                setError("");
    
                if (newMessage && typeof onMessageSent === "function") {
                    onMessageSent(newMessage);
                }
            } catch (err) {
                setError("Failed to send message");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type here..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default ChatInterface