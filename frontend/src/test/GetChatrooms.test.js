import axios from "axios";
import { getUserId } from "../GetUserId";
import { getChatrooms } from "../GetChatrooms";

jest.mock("axios");
jest.mock("../GetUserId");

beforeEach(() => {
    jest.clearAllMocks();
});

test("returns chatrooms when API call is successful", async () => {
    const mockUserId = "12345";
    const mockChatrooms = [{ _id: "1", name: "Test Chatroom" }];

    getUserId.mockResolvedValueOnce(mockUserId);
    axios.get.mockResolvedValueOnce({ data: mockChatrooms });

    const result = await getChatrooms();

    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`http://localhost:5000/api/chatrooms/rooms/${mockUserId}`);
    expect(result).toEqual(mockChatrooms);
});

test("returns empty array when user ID mot found", async () => {
    getUserId.mockResolvedValueOnce(null);

    const result = await getChatrooms();

    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(axios.get).not.toHaveBeenCalled();
    expect(result).toEqual([]);
});

test("returns empty array when API fails", async () => {
    const mockUserId = "12345";

    getUserId.mockResolvedValueOnce(mockUserId);
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    const result = await getChatrooms();

    expect(getUserId).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(`http://localhost:5000/api/chatrooms/rooms/${mockUserId}`);
    expect(result).toEqual([]);
});
