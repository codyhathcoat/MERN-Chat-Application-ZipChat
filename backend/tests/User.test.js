const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../User"); //Import the user model.

let mongoServer;

beforeAll(async() => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    await mongoose.connection.dropDatabase();
})

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("User Model Test Suite", () => {

    test("should create and save user successfully", async() => {
        const validUser = new User({
            username: "testuser",
            password: "securepassword123",
            first_name: "Jack",
            last_name: "Doe"
        });
        const savedUser = await validUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe("testuser");
        expect(savedUser.password).toBe("securepassword123");
        expect(savedUser.first_name).toBe("Jack");
        expect(savedUser.last_name).toBe("Doe");
        expect(savedUser.avatarColor).toBe("#3498db"); //Default color.
    });

    test("should fail if missing username", async () => {
        const userWithOutUsername = new User({password: "password123"});

        let err;
        try{
            await userWithOutUsername.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeDefined();
        expect(err.errors.username).toBeDefined();

    });

    test("should fail if missing password", async() => {
        const userWithoutPassword = new User({username: "testname"});

        let err;
        try{
            await userWithoutPassword.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });

    test("should allow optional fields to be empty", async () => {
        const userWithoutName = new User({
            username: "Testuser123",
            password: "pass123"
        });

        const savedUser = await userWithoutName.save();

        expect(savedUser.first_name).toBeUndefined();
        expect(savedUser.last_name).toBeUndefined();
    });
});