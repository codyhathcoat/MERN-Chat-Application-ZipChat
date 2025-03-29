import React from "react";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChatroom } from "./GetChatroom.js";
import { getUserId } from "./GetUserId.js";
import ChatInterface from "./ChatInterface";
import Avatar from "./Avatar";
import socket from "./socket";

const ChatroomDisplay = () => {
    const navigate = useNavigate();
    const { chatroomId } = useParams();
    const [chatroom, setChatroom] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);


    //Gets chatroom info and fills box
    const fetchChatroom = async () => {
        try {
            const data = await getChatroom(chatroomId);
            setChatroom(data);
        } catch (err) {
            setError("Failed to load chatroom");
        }
    };

    //Retrieves user ID
    const fetchUserId = async () => {
        try {
            const id = await getUserId();
            setUserId(id);
        } catch (err) {
            setError("Failed to load user ID");
        }
    };

    //UID
    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        socket.emit("join_room", chatroomId);

        fetchChatroom();

        //Listen for messages
        socket.on("receive_message", (newMessage) => {
            console.log("Received from socket:", newMessage);
            setChatroom((prev) => ({
                ...prev,
                messages: [...prev.messages, newMessage]
            }));
        });

        //Clean up
        return () => {
            socket.emit("leave_room", chatroomId);
            socket.off("receive_message");
        };
    }, [chatroomId]);

    useEffect(() => {
        if(messagesEndRef.current){
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatroom?.messages?.length]); //Scroll when messages change

    if (error) 
        return <p>{error}</p>;

    if (!chatroom || !chatroom.messages || !chatroom.members)
        return (<p>Loading chatroom...</p>);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
          <button
            onClick={() => navigate("/home")}
            className="mb-6 self-start bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Return Home
          </button>
      
          <h2 className="text-3xl font-bold text-blue-600 mb-4">{chatroom.name}</h2>
      
          <h3 className="text-xl font-semibold mb-2">Members:</h3>
          <ul className="mb-6 space-y-2">
            {chatroom.members.map((user) => (
              <li key={user._id} className="flex items-center gap-2">
                <Avatar
                  firstname={user.first_name || ""}
                  lastname={user.last_name || ""}
                  color={user.avatarColor || "#3498db"}
                  size={40}
                />
                <span>{user.username}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mb-2">Messages:</h3>
          <div className="border border-gray-300 rounded-lg p-4 max-w-xl w-full h-80 overflow-y-auto bg-white mb-6">
            {chatroom.messages.length > 0 ? (
              chatroom.messages.map((msg) => {
                const sender = msg.sender
                  ? chatroom.members.find((user) => user._id === msg.sender._id)
                  : null;
      
                return (
                  <div key={msg._id} className="mb-4">
                    <div className="text-sm flex items-center gap-2">
                      <Avatar
                        firstname={sender?.first_name || ""}
                        lastname={sender?.last_name || ""}
                        color={sender?.avatarColor || "#3498db"}
                        size={40}
                      />
                      <p className="font-medium">{sender?.username}:</p> {msg.content}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()} •{" "}
                      {new Date(msg.timestamp).toLocaleDateString()} by {sender?.first_name} {sender?.last_name}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500">No messages yet.</p>
            )}
            <div ref={messagesEndRef} />
          </div>
      
          <div className="mt-4 w-full max-w-xl">
            <ChatInterface chatroomId={chatroomId} sender={chatroom.members.find((m) => m._id === userId)} />
          </div>
        </div>
      );
}

const styles = {
    homeButton: {
      background: "#808080", 
      color: "black",
      border: "none",
      padding: "5px 10px",
      cursor: "pointer",
      borderRadius: "5px",
    },
  };

export default ChatroomDisplay;