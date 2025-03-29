import React, {useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
            username,
            password
        });
        setMessage("Registration Successful! You can now login.");
    } catch(error) {
        console.error(error);
        setMessage("Registration failed. Try a different username.");
    }
};

return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
  
        <nav className="mb-6 text-center text-sm text-blue-500 space-x-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <span>|</span>
          <Link to="/register" className="hover:underline">Register</Link>
        </nav>

        {message && (
            <p
                className={`mb-4 text-sm text-center ${
                    message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
                }`}
            >
                {message}
            </p>
        )}
 

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                const value = e.target.value;
                if (value.includes(",")) {
                  setMessage("Commas are not allowed in usernames.");
                  return;
                }
                setMessage("");
                setUsername(value.slice(0, 30));
              }}
              required
              maxLength={30}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value.slice(0, 30));
              }}
              required
              maxLength={30}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
  
}
export default Register;