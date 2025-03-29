import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Name() {
    const navigate = useNavigate();
    const colorOptions = ["#3498db", "#FF6347", "#32CD32", "#FFD700", "#FF69B4", "#8A2BE2"];

    const username = localStorage.getItem("username");

    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [selectedColor, setSelectedColor] = useState("#3498db")

    useEffect(() => {
        const fetchUserData = async() => {
            try{
                const response = await axios.get(`http://localhost:5000/api/auth/user/${username}`);
                const {first_name, last_name, avatarColor} = response.data;
                console.log("User Data recieved:", response.data);

                setFirstName(first_name || "");
                setLastName(last_name || "");
                setSelectedColor(avatarColor|| "#3498db");

                localStorage.setItem("first_name", first_name);
                localStorage.setItem("last_name", last_name);
                localStorage.setItem("avatarColor", avatarColor);
            } catch (error){
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [username]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/api/auth/setname", {
                first_name,
                last_name,
                avatarColor: selectedColor,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            localStorage.setItem("first_name", first_name);
            localStorage.setItem("last_name", last_name);
            localStorage.setItem("avatarColor", selectedColor);

            console.log("Response from setname:", response.data);
            if(response.data.redirect){
                navigate("/home");
            }
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-100 flex flex-col items-center pt-20">
            <button
                type="button"
                onClick={() => navigate("/home")}
                className="absolute top-0 right-2 bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500 transition whitespace-nowrap"
            >
                Return Home
            </button>

            <h1 className="text-4xl font-extrabold text-bule-600 mb-6 tracking-tight">
                Profile Page
            </h1>

            {/*Everything below will appear in the specified area*/}
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <label htmlFor="first_name" className="block text-sm font-medium mb-1">First Name</label>
                <input 
                    id="first_name"
                    type="text"
                    value={first_name}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFirstName(value.slice(0, 30));
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />

                <label htmlFor="last_name" className="block text-sm font-medium mb-1">Last Name</label>
                <input 
                    id="last_name"
                    type="text"
                    value={last_name}
                    onChange={(e) => {
                        const value = e.target.value;
                        setLastName(value.slice(0, 30));
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />

                <h3 className="text-sm font-semibold mt-8 mb-2">Avatar Color</h3>
                <div className="flex gap-3 mt-2">
                    {colorOptions.map((color) => (
                        <div    
                            key={color}
                            data-testid="avatar-color-option"
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full cursor-pointer border-2 ${selectedColor === color ? "ring-black" : "border-gray-400"}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                <button 
                    type="submit"
                    className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    onClick={handleSubmit}
                >
                    Save
                </button>
            </div>
        </div>
    )
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
export default Name;