import React, { useState, useEffect} from "react";
import axios from "axios";
import Chatrooms from "./Chatrooms";
import ChatInterface from "./ChatInterface";
import ChatroomList from "./ChatroomList";
import MakeChatroom from "./MakeChatroom";
import{useNavigate} from "react-router-dom";
import Avatar from "./Avatar.js"
import Name from "./Name";

function Home(){
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const username = localStorage.getItem("username"); //This gets the username from local storage
    const currentUser = {
        first_name: localStorage.getItem("first_name") || "",
        last_name: localStorage.getItem("last_name") || "",
        avatarColor: localStorage.getItem("avatarColor") || "#3498db",
    };
    

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("first_name")
        localStorage.removeItem("last_name")
        localStorage.removeItem("avatarColor")

        localStorage.removeItem("username")

        navigate("/login");
    };

    const handleProfile = () => {
        navigate("/Name")
    }

    const ProfileButton = ({handleProfile}) => {
        return(
           <button onClick={handleProfile} style={styles.profileContainer}>
                Profile
            </button>
        )
    }
    const styles = {
        buttonContainer: {
            position: "fixed",
            top: "10px",
            right: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px", // Adds space between the profile and logout buttons
        },

        profileContainer: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            overflow: "hidden",
            transition: "box-shadow 0.3s ease",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        },

        logoutButton: {
            padding: "10px 15px",
            background: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s ease",
        },
    };
    return(
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-12">
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-600">
                Welcome to the Home Page!
            </h1>

            <div className="flex gap-4 mb-6">
                <ProfileButton
                    handleProfile={handleProfile}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                />

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                >
                    Sign Out
                </button>
            </div>

            <div className="2-full max-w-xl px-4">
                <MakeChatroom />
                <ChatroomList />
            </div>
        </div>
    );
};

export default Home;