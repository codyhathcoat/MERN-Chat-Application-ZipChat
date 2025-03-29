import axios from "axios";
import { getChatroom } from "../GetChatroom"

jest.mock('axios'); //Mock axios

beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();

});

test("fetches and returns chatroom data successfully", async () => {
    const chatroomId = "abc123";
    const mockChatroomData = {
        id: chatroomId,
        name: "Test Room",
        members: [{ id: "1", username: "user1" }],
        messages: [{ sender: { id: "1", username: "user1" }, content: "Hello!" }],
    };

    axios.get.mockResolvedValueOnce({ data: mockChatroomData });

    const chatroom = await getChatroom(chatroomId);

    expect(chatroom).toEqual(mockChatroomData);
    expect(axios.get).toHaveBeenCalledWith(`http://localhost:5000/api/chatrooms/abc123`);
});

test("handles any API errors", async () => {
    const chatroomId = "abc123";

    axios.get.mockRejectedValueOnce({
        response: { data: "Chatroom not found" },
    });

    const chatroom = await getChatroom(chatroomId);

    expect(chatroom).toBeNull();
    expect(console.error).toHaveBeenCalledWith("Error fetching chatroom:", "Chatroom not found");
});

test("handles network errors", async () => {
    const chatroomId = "abc123";

    axios.get.mockRejectedValueOnce(new Error("Network error"));

    const chatroom = await getChatroom(chatroomId);

    expect(chatroom).toBeNull();
    expect(console.error).toHaveBeenCalledWith("Error fetching chatroom:", "Network error");
});