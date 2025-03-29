import React, { useState } from "react";
import { createChatroom } from "./CreateChatroom";

const MakeChatroom = () => {
    const [name, setName] = useState("");
    const [usernames, setUsernames] = useState("");
    const [message, setMessage] = useState("");


    const handleCreate = async () => {
        const usernameArray = usernames.split(",").map(u => u.trim());
        const username = localStorage.getItem("username")

        if (!usernameArray.includes(username)) {
            usernameArray.push(username);
        }

        try {
            await createChatroom(name, usernameArray);
            setMessage("Chatroom created successfully!");
            setName("");
            setUsernames("");
        } catch (error) {
            setMessage(error.response?.data?.error || "Failed to create chatroom. Please try again.");
        }
    };

    return(
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Create a Chatroom</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Room Name (required)"
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                type="text"
                value={usernames}
                onChange={(e) => setUsernames(e.target.value)}
                placeholder="Usernames (comma separated)"
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                onClick={handleCreate}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
                Create
            </button>

            {message  && (
                <p 
                    className={`mt-4 text-center text-sm ${
                        message.toLowerCase().includes("created") ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default MakeChatroom;