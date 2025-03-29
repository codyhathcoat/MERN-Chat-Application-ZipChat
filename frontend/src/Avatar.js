import React from "react";

const Avatar = ({firstname, lastname, color, size = 40}) =>{
    const initials = `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase().trim() || "?";

    const avatarStyle = {
        width: size,
        height: size,
        backgroundColor: color,
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontsize: size / 2,
        borderRadius: "50%",
        fontWeight: "bold",
    };
    return <div style={avatarStyle}>{initials}</div>;
};

export default Avatar;