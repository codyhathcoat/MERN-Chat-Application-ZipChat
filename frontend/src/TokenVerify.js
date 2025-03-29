import {jwtDecode} from "jwt-decode"; //MUST npm install jwt-decode

export const checkTokenExpiry = () => {
    const token = localStorage.getItem("token");
    if (!token) return false; // No token, user is not logged in

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        if (decoded.exp < currentTime) {
            console.log("Token expired! Logging out...");
            localStorage.removeItem("token"); // Remove expired token
            return false; // Token expired
        }

        return true; // Token is still valid
    } catch (error) {
        console.error("Invalid token!", error);
        return false;
    }
};
