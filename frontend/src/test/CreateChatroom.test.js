import axios from "axios";
import { createChatroom } from "../CreateChatroom";

jest.mock("axios");

test("successfully creates a chatroom", async () => {
    const mockResponse = { data: { name: "Test Room", members: ["user1", "user2"] } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await createChatroom("Test Room", ["user1", "user2"]);

    expect(result).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/chatrooms", {
        name: "Test Room",
        members: ["user1", "user2"],
    });
});

test("handles chatroom creation failure", async () => {
    const error = new Error("Failed to create chatroom");
    axios.post.mockRejectedValueOnce(error);

    await expect(createChatroom("Test Room", ["user1", "user2"])).rejects.toThrow("Failed to create chatroom");
});

