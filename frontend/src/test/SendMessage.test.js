import axios from "axios";
import { sendMessage } from "../SendMessage";

jest.mock("axios");

test("successfully sends a message", async () => {
    const mockResponse = { data: { message: "Hello", sender: "user1" } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await sendMessage("chatroom123", "user1", "Hello");

    expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/chatrooms/chatroom123/message",
        { sender: "user1", content: "Hello" }
    );
    expect(result).toEqual(mockResponse.data);
});

test("handles message sending failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Failed to send message"));

    const result = await sendMessage("chatroom123", "user1", "Hello");

    expect(axios.post).toHaveBeenCalled();
    expect(result).toBeNull();
});
