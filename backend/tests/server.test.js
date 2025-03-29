const request = require("supertest"); //Super test for HTTP requests
const {app} = require("../server"); //IMport Express app
const { connectDB, closeDB } = require("../db");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

process.env.NODE_ENV = "test";
jest.setTimeout(10000);
let mongoServer;
let server;

//Group server start up.
describe("Server Setup", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const testMongoUri = mongoServer.getUri();
        await connectDB(testMongoUri);

        server = app.listen(0, () => console.log(`Test server running on Port ${server.address().port}`));
    });

    afterAll(async () => {
        await closeDB();
        if(mongoServer) {
            await mongoServer.stop();
        }

        if(server && server.listening){
            await new Promise((resolve) => server.close(resolve));
        }
    });

    //it defines a test case
    //Super test sends HTTP req
    
    it("should return 404 for unknown routes", async () => {
        const response = await request(app).get("/unknown");
        expect(response.statusCode).toBe(404);
    });

    it("should response with 200 on the auth route", async () => {
        const response = await request(app).get("/api/auth");
        expect(response.statusCode).toBe(200);
    });

    it("should response with 200 on the chatroom routes", async () => {
        const response = await request(app).get("/api/chatrooms");
        expect(response.statusCode).toBe(200);
    });

    //Test CORS headers enabled.
    it("should have CORS headers enabled", async () => {
        const response = await request(app).options("/api/auth");
        expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
        expect(response.headers["access-control-allow-methods"]).toBe("GET, POST, PUT, DELETE");
        expect(response.headers["access-control-allow-credentials"]).toBe("true");
    });

    it("should correctly parse JSON body", async () => {
        const testPayload = {username: "testuser", password: "password123"};
        const response = await request(app)
            .post("/api/auth")
            .send(testPayload)
            .set("Content-Type", "application/json");

        expect(response.statusCode).toBe(200); //Expected response.
        expect(response.body).toBeDefined(); //Ensure respone recieved.
    });

    it("should start without errors", async () =>  {
        expect(server.listening).toBeTruthy();
    });

});