const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {connectDB} = require("./db");
const http = require("http");
const { Server } = require("socket.io");

//app.use(express.json()); //?
dotenv.config(); //Load environment variables.

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

//Parse JSON bodies
app.use(express.json());
//Enable CORS
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
//Connect to mongo db
connectDB();
//Authentication routes.
app.use("/api/auth", require("./auth"));
//Chatroom routes
app.use("/api/chatrooms", require("./chatroomRoutes"))

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("send_message", (data) => {
        const fullMessage = {
            content: data.content,
            sender:{
                _id: data.sender._id,
                username: data.sender.username,
                first_name: data.sender.first_name,
                last_name: data.sender.last_name,
                avatarColor: data.sender.avatarColor
            },
            timestamp: data.timestamp || new Date()
        };
        io.to(data.room).emit("receive_message",  fullMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
});

//Middleware to attach io to reqs
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.set("io", io);

//const PORT = process.env.PORT || 5000;
let server;
if(process.env.NODE_ENV !== "test"){
    const PORT = process.env.PORT || 5000;
    server = httpServer.listen(PORT, () => 
        console.log(`Server running on port ${PORT}`)
    );
}

module.exports = {app, server};
