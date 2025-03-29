//Login form and sending login request to backend
import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

function Login({setIsLoggedIn}) {
    console.log("Rending Login Component");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault(); //Prevent default form submission

        try{
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                username, 
                password,
            });

            const{token, redirect} = response.data //extract token.

            if(token){ //Added this if statement
                //Save the token for other authenticated requests
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                setIsLoggedIn(true);
                setMessage("Login successful! Redirecting...");

                if (redirect) {
                    navigate("/name");
                } else {
                    //setIsLoggedIn(true);
                    //setMessage("Login successful!");
                    navigate("/home");
                }
            }
            
        } catch(error) {
            console.error(error);
            setMessage("Login failed. Please check your credentials.");
        }
    };

    return(
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

                <nav className="text-center mb-6 text-sm text-blue-500 space-x-2">
                    <Link to="/login" className="hover:underline">Login</Link> |
                    <Link to="/register" className="hover:underline">Register</Link>
                </nav>

                {message && <p className="mb-4 text-sm text-red-500 text-center">{message}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block font-medium text-sm mb-1">Username</label>
                        <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.slice(0, 30))}
                        required
                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium text-sm mb-1">Password</label>
                        <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.slice(0, 30))}
                        required
                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;