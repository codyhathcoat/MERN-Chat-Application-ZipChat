const mongoose = require("mongoose");
const { connectDB, closeDB } = require("../db");
const { MongoMemoryServer } = require("mongodb-memory-server"); //In memory DB

jest.setTimeout(5000);
let mongoServer; //Hold in-memory MongoDB instance

describe("Database Connection",  () => {
    beforeAll(async () => {
        //Start an in-memory MongoDB instance
        mongoServer = await MongoMemoryServer.create();
        //const mongoUri = mongoServer.getUri();
        const testMongoUri = mongoServer.getUri();
        await connectDB(testMongoUri);
        //process.env.MONGO_URI = mongoServer.getUri(); //Mock MONGO_URI
    });

    afterAll(async() => {
        await closeDB();
        if(mongoServer){
            await mongoServer.stop();
        }
    });

    test("should connect to MongoDB successfully", async () => {
       expect(mongoose.connection.readyState).toBe(1); //1 = connected
    });

    test("should handle connection errors properly", async () => {
       const invalidMongoUri = "mongodb://localhost:9999/test_db";
   
        //process.env.MONGO_URI = invalidMongoUri
        await expect(connectDB(invalidMongoUri)).rejects.toThrow("Database connection failed");
    }, 10000);

    test("should close data base connection successfully", async() => {
       await closeDB();
       expect(mongoose.connection.readyState).toBe(0); //0 = Disconnected
    });

    test("should handle errors when closing the connection", async () => {

        const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

        //Close DB first
        await closeDB();

        //Try closing again, should throw error.
        await expect(closeDB()).resolves.not.toThrow();

        //Check if error was logged.
        expect(consoleSpy).toHaveBeenCalledWith("No active connection to close");
        consoleSpy.mockRestore();
    });

    test("should throw an error if MONGO_URI is not set", async () => {
        const originalEnv = process.env.MONGO_URI;
        delete process.env.MONGO_URI;

        await expect(connectDB()).rejects.toThrow("Database connection failed");

        process.env.MONGO_URI = originalEnv;
    });

    test("should handle connection failure and throw an error", async() => {
        const connectSpy = jest.spyOn(mongoose, "connect").mockRejectedValueOnce(new Error("Failed to connect"));
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        const testMongoUri = "mongodb://localhost:9999/test_db";

        await expect(connectDB(testMongoUri)).rejects.toThrow("Database connection failed");

        expect(consoleSpy).toHaveBeenCalledWith("MongoDB not connected.", expect.any(Error));

        connectSpy.mockRestore();
        consoleSpy.mockRestore();
    });
}, 10000);