import React from "react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChatrooms } from "./GetChatrooms";
import Chatrooms from "./Chatrooms";
import socket from "./socket";

const ChatroomList = ({setRefresh}) => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [refresh, setRefresh] = useState(false);

  const fetchChatrooms = async () => {
    try {
      const data = await getChatrooms();
      setChatrooms(data || []);
    } catch (error) {
      console.error("Error fetching chatrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatrooms();

    socket.on("chatroom_created", (newRoom) => {
      setChatrooms(prev => [...prev, newRoom]);
    });

    socket.on("chatroom_deleted", (id) => {
      setChatrooms(prev => prev.filter(room => room._id !== id));
    });

    return () => {
      socket.off("chatroom_created");
      socket.off("chatroom_deleted");
    };

    //const interval = setInterval(fetchChatrooms, 500);
    //return () => clearInterval(interval);
  }, []);

  const deleteChatroom = async(chatroomId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this chatroom?");
    if(!confirmDelete) return;

    console.log("Deleting chatroom with ID:", chatroomId);
    try{
      const response = await fetch(`http://localhost:5000/api/chatrooms/${chatroomId}`, {
        method: "DELETE",
      });

      if(!response.ok){
        throw new Error("Failed to delete chatroom");
      }
      setChatrooms((prevChatrooms) => prevChatrooms.filter((chatroom) => chatroom._id !== chatroomId));
      setRefresh(prev => !prev);
      //fetchChatrooms();
      
    } catch(error){
        console.error("Error deleting chatroom:", error);
    }
  }
  if (loading) return <p>Loading chatrooms...</p>;

  return(
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-2-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">Available Chatrooms</h2>

      {chatrooms.length === 0 ? (
        <p className="text-center text-gray-500">No chatrooms available.</p>
      ) : (
        <ul className="space-y-4">
          {chatrooms.map((room) => (
          <li
            key={room._id}
            className="border p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:justify-between items-start sm:items-center"
          >
            <div>
              <Link
              to={`/chatroom/${room._id}`}
              className="text-lg font-semibold text-blue-500 hover:underline"
              >
                {room.name}
              </Link>
              <p className="text-sm text-gray-600mt-1 sm:mt-0">
                Members: {room.members.map((p) => p.username).join(", ")}
              </p>
            </div>
            
            <button
              onClick={() => deleteChatroom(room._id)}
              className="mt-2 sm:mt-0 sm:ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          </li>
          ))}  
        </ul>   
      )}
    </div>
  );

  /*
  return (
    <div>
      <h2>Available Chatrooms</h2>
      {chatrooms.length === 0 ? (
        <p>No chatrooms available.</p>
      ) : (
        <ul>
          {chatrooms.map((room) => (
            <li key={room._id}>
              <Link to={`/chatroom/${room._id}`}>{room.name}</Link>
              <p>Members: {room.members.map(p => p.username).join(", ")}</p>

              <button
                onClick={() => deleteChatroom(room._id)}
                style={styles.deleteButton}
              >Delete</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
  */
};

const styles = {
  deleteButton: {
    background: "#d32f2f", 
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default ChatroomList;
