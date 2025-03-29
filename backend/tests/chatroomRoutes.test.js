const request = require("supertest"); //Support HTTP reqs
const { app } = require("../server");
const { connectDB, closeDB } = require("../db");
const { MongoMemoryServer } = require("mongodb-memory-server"); //In mem database for testing.
const User = require("../User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Chatroom = require("../Chatroom")

let mongoServer; //Store in memory MongoDB instance.
let server;
//jest.mock("../User");
jest.setTimeout(10000); //Set test timeout


beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create(); //Start in memory server.
    await connectDB(mongoServer.getUri())
    process.env.JWT_SECRET = "testsecret";
    server = app.listen(0, () => console.log(`Test server running on Port ${server.address().port}`));

});

afterAll(async () => {
    await closeDB();
    await mongoServer.stop();
    // jest.clearAllMocks();

    if (server && server.listening) {
        await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.connection.close();
});

describe("chatroom routes", () => {
    let testUserIds;
    let testUser1;
    let testUser2;
    let chatroomId;
    let token;

    beforeEach(async () => {
        await mongoose.connection.dropDatabase(); // Clear database before each test
        await User.deleteMany({}); // Clear User collection
    
        testUser1 = await User.create({
            username: "testuser1",
            password: "1",
            first_name: "Rob",
            last_name: "Bob",
        });
    
        testUser2 = await User.create({
            username: "testuser2",
            password: "1",
            first_name: "Alice",
            last_name: "Smith",
        });
    
        const testChatroom = await Chatroom.create({
            name: "Test Chatroom",
            members: [testUser1._id, testUser2._id],
        });
    
        testUserIds = {
            testUser1: testUser1._id.toString(),
            testUser2: testUser2._id.toString(),
        };
    
        chatroomId = testChatroom._id.toString();
    
        token = jwt.sign({ id: testUser1._id.toString() }, process.env.JWT_SECRET);
    });
    

    //test get all chatrooms
    test("should fetch all chatrooms", async () => {
        const res = await request(app).get("/api/chatrooms/");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("invalid chatroom fetch", async () => {
        jest.spyOn(Chatroom, "find").mockImplementationOnce(() => {
            throw new Error("Database error");
        });
        const res = await request(app).get("/api/chatrooms/");
        expect(res.status).toBe(500);
    });

    //test get chatrooms by user id
    test("should fetch chatrooms for a specific user", async () => {
        const userId = testUserIds.testUser1;
        const res = await request(app).get(`/api/chatrooms/rooms/${userId}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("should error with bad userid", async () => {
        const userId = "lol";
        const res = await request(app).get(`/api/chatrooms/rooms/${userId}`);
        expect(res.status).toBe(500);
    });

    //test post create new chatroom
    test("should create a new chatroom with valid data", async () => {
        const newChatroom = { name: "Test Room", members: ["testuser1", "testuser2"] };
        const res = await request(app).post("/api/chatrooms").send(newChatroom);
        console.log(res.error)
        expect(res.status).toBe(201);
        expect(res.body.name).toBe("Test Room");
    });

    test("should return 400 for missing name in chatroom creation", async () => {
        const res = await request(app).post("/api/chatrooms").send({ members: ["testuser1", "testuser2"] });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("A chatroom must have a name.");
    });

    test("should return 400 for insufficient members in chatroom creation", async () => {
        const res = await request(app).post("/api/chatrooms").send({ name: "Test Room", members: ["testuser1"] });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("A chatroom must have at least two members.");
    });

    test("should return 400 if some usernames are not found", async () => {
        const res = await request(app).post("/api/chatrooms").send({ name: "Test Room", members: ["testuser1", "testuser3"] });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Some usernames were not found.");
    });

    //test get chatroom by id
    test("should fetch a chatroom by id", async () => {
        const res = await request(app).get(`/api/chatrooms/${chatroomId}`);
        console.log(res.error)
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name");
    });

    //test post send a message
    test("should send a message to a chatroom", async () => {
        const messageData = { sender: testUserIds.testUser1, content: "Hello, world!" };
        const res = await request(app).post(`/api/chatrooms/${chatroomId}/message`).send(messageData);
        console.log(res.error)
        expect(res.status).toBe(200);
        expect(res.body.messages).toHaveLength(1);
        expect(res.body.messages[0].content).toBe("Hello, world!");
    });

    //test delete chatroom by id
    test("should delete a chatroom", async () => {
        const res = await request(app).delete(`/api/chatrooms/${chatroomId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Chatroom deleted successfully");
    });

    test("should return 400 for invalid chatroom id format", async () => {
        const invalidChatroomId = "invalidId";
        const res = await request(app).delete(`/api/chatrooms/${invalidChatroomId}`);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid chatroom ID format.");
    });

});