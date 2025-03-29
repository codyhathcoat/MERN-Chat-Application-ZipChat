import React, {useState, useEffect} from "react";
import{BrowserRouter as Router, Routes, Route, useAsyncError} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Name from "./Name";
import Chatroom from "./Chatrooms";
import ChatroomDisplay from "./ChatroomDisplay";
import {Link} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            try{
                const payload = JSON.parse(atob(token.split(".")[1])); //Decode JWT payload
                const isExpired = payload.exp * 1000 < Date.now(); //Convert exp to milliseconds
                if(isExpired){
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                } else {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Invalid token format:", error);
                localStorage.removeItem("token");
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    }, []);
    if (loading){
        return <div>Loading...</div>
    }

    return(
        <Router>
            <div className="App">
            <h1 className="text-5xl font-bold mb-8 text-left">
                <span className="text-yellow-500">Zip</span>
                <span className="text-blue-700">Chat</span>
            </h1>
                <Routes>
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
                    <Route path="/register" element={<Register />}/>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<Home />} />
                    </Route>

                    <Route path="/home" element={<Home />}/>
                    <Route path="/name" element={<Name />}/>
                    <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn}/>}/>
                    <Route path="/chatroom/:chatroomId" element={<ChatroomDisplay />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
