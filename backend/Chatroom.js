const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    timestamp: {type: Date, default: Date.now}
})

const ChatroomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [MessageSchema]
})

module.exports = mongoose.model("Chatroom", ChatroomSchema)