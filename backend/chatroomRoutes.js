const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Chatroom = require('./Chatroom');
const User = require('./User');


router.get("/", async (req, res) => {
    try {
        const chatrooms = await Chatroom.find().populate("members", "username");
        res.json(chatrooms);
    } catch (err) {
        console.error("Error fetching chatrooms:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/rooms/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const chatrooms = await Chatroom.find({ members: userId }).populate("members", "username");
        res.json(chatrooms);
    } catch (err) {
        console.error("Error fetching chatrooms:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, members } = req.body;
        const users = await User.find({ username: { $in: members } });

        if(!name || name.trim().length === 0) {
            return res.status(400).json({ error: "A chatroom must have a name." });
        }

        if(!members || members.length < 2) {
            return res.status(400).json({ error: "A chatroom must have at least two members." });
        }

        if(users.length !== members.length){
            return res.status(400).json({ error: "Some usernames were not found." });
        }

        const chatroom = new Chatroom({
            name,
            members: users.map((u) => u._id),
        });

        const savedChatroom = await chatroom.save();

        const populatedChatroom = await Chatroom.findById(savedChatroom._id).populate(
            "members",
            "username first_name last_name avatarColor"
        );

        const io = req.app.get("io");
        io.emit("chatroom_created", populatedChatroom);

        res.status(201).json(populatedChatroom);
    } catch (error) {
        console.error("Error creating chatroom:", error);
        res.status(500).send({error: "Failed to create chatroom" });
    }
});

router.get("/:chatroomId", async (req, res) => {
    try {
        const { chatroomId } = req.params;

        // populate users and messages
        const chatroom = await Chatroom.findById(chatroomId)
            .populate("members", "username first_name last_name avatarColor")
            .populate("messages.sender", "username first_name last_name avatarColor")
            .exec();

        if (!chatroom) {
            return res.status(404).json({ error: "Chatroom not found" });
        }


        ///added await
        await Chatroom.populate(chatroom,{
            path: "messages.sender",
            select: "username firstname lastname color"
        });

        res.json(chatroom);
    } catch (err) {
        console.error("Error fetching chatroom:", err);
        res.status(500).json({ error: err.message });
    }
});

// Send message in a chatroom
router.post('/:id/message', async (req, res) => {
    try {
        const { sender, content } = req.body;
        const chatroom = await Chatroom.findById(req.params.id);
        if (!chatroom) return res.status(404).json({ error: 'Chatroom not found' });

        //Added
        const user = await User.findById(sender);
        if(!user) return res.status(400).json({error:  "Invalid sender ID"});
        const newMessage = {sender: user._id, content};
        chatroom.messages.push(newMessage);
        await chatroom.save();
        await chatroom.populate("messages.sender", "username first_name last_name avatarColor");
        res.json(chatroom);

        /*
        chatroom.messages.push({ sender, content });
        console.log(chatroom)
        console.log(sender)
        console.log(content)
        await chatroom.save();
        res.json(chatroom);
        */
    }
    catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err)
    }
});

router.delete("/:id", async(req, res) => {
    try{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid ObjectId format:", id);
            return res.status(400).json({ message: "Invalid chatroom ID format." });
        }
        const deleted = await Chatroom.findByIdAndDelete(id);
        if(!deleted) return res.status(404).send("Chatroom not found");

        const io = req.app.get("io");
        io.emit("chatroom_deleted", id);

        res.status(200).json({ message: "Chatroom deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: "Failed to delete chatroom." });
    }
});

module.exports = router;