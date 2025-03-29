import axios from "axios";

export const getUserId = async () => {
    try {
        const username = localStorage.getItem("username")
        const res = await axios.get(`http://localhost:5000/api/auth/${username}`);
        console.log("User ID:", res.data.id);
        //console.log(username)
        return res.data.id
    } catch (err) {
        console.error("Error fetching UID:", err.response?.data || err.message);
    }
};